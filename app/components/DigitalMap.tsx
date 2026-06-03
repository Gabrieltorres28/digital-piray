"use client";

import Image from "next/image";
import type { PointerEvent, WheelEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { AmbientOverlay } from "./AmbientOverlay";
import { BirdFlock } from "./BirdFlock";
import { FallingLeaves } from "./FallingLeaves";
import { GameButton } from "./GameButton";

type DigitalMapProps = {
  isEnteringChurch: boolean;
  onEnterChurch: () => void;
};

type Point = {
  x: number;
  y: number;
};

const IMAGE_WIDTH = 1672;
const IMAGE_HEIGHT = 941;
const CHURCH_X = 35.7;
const CHURCH_Y = 27.5;
const MIN_SCALE = 1;
const MAX_SCALE = 2.8;
const ZOOM_STEP = 0.18;

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, [role=button]"));
}

function clampOffset(offset: Point, scale: number) {
  const maxX = Math.max(0, (window.innerWidth * (scale - 1)) / 2);
  const maxY = Math.max(0, (window.innerHeight * (scale - 1)) / 2);

  return {
    x: clamp(offset.x, -maxX, maxX),
    y: clamp(offset.y, -maxY, maxY),
  };
}

export function DigitalMap({ isEnteringChurch, onEnterChurch }: DigitalMapProps) {
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const pointers = useRef(new Map<number, Point>());
  const lastPanPoint = useRef<Point | null>(null);
  const lastPinch = useRef<number | null>(null);

  const updateScale = useCallback((nextScale: number) => {
    setScale((currentScale) => {
      const clampedScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      setOffset((currentOffset) => clampOffset(currentOffset, clampedScale));
      return clampedScale;
    });
  }, []);

  const zoomBy = useCallback(
    (delta: number) => {
      updateScale(scale + delta);
    },
    [scale, updateScale],
  );

  const resetView = useCallback(() => {
    setScale(MIN_SCALE);
    setOffset({ x: 0, y: 0 });
    pointers.current.clear();
    lastPanPoint.current = null;
    lastPinch.current = null;
    setIsInteracting(false);
  }, []);

  const sceneTransform = useMemo(
    () => `translate(-50%, -50%) translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
    [offset.x, offset.y, scale],
  );

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLElement>) => {
      event.preventDefault();
      zoomBy(event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP);
    },
    [zoomBy],
  );

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (isInteractiveTarget(event.target)) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);
    lastPanPoint.current = point;
    setIsInteracting(true);

    if (pointers.current.size === 2) {
      const [first, second] = Array.from(pointers.current.values());
      lastPinch.current = distance(first, second);
    }
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!pointers.current.has(event.pointerId)) {
        return;
      }

      const point = { x: event.clientX, y: event.clientY };
      pointers.current.set(event.pointerId, point);

      if (pointers.current.size === 2) {
        const [first, second] = Array.from(pointers.current.values());
        const nextPinch = distance(first, second);
        const previousPinch = lastPinch.current ?? nextPinch;
        const nextScale = clamp(scale + (nextPinch - previousPinch) / 250, MIN_SCALE, MAX_SCALE);
        lastPinch.current = nextPinch;
        updateScale(nextScale);
        return;
      }

      if (lastPanPoint.current && scale > MIN_SCALE) {
        const dx = point.x - lastPanPoint.current.x;
        const dy = point.y - lastPanPoint.current.y;
        setOffset((current) => clampOffset({ x: current.x + dx, y: current.y + dy }, scale));
      }

      lastPanPoint.current = point;
    },
    [scale, updateScale],
  );

  const handlePointerEnd = useCallback((event: PointerEvent<HTMLElement>) => {
    pointers.current.delete(event.pointerId);
    lastPinch.current = null;
    setIsInteracting(pointers.current.size > 0);
    lastPanPoint.current = pointers.current.size === 1 ? Array.from(pointers.current.values())[0] : null;
  }, []);

  return (
    <section
      className="relative min-h-dvh overflow-hidden bg-[#050709] text-white selection:bg-cyan-200/30"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(45,212,191,0.16),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.7))]" />

      <div
        className="absolute left-1/2 top-1/2 origin-center touch-none will-change-transform"
        style={{
          aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}`,
          filter: isEnteringChurch ? "brightness(0.72) saturate(1.04)" : "brightness(1) saturate(1)",
          height: `max(100dvh, calc(100dvw * ${IMAGE_HEIGHT / IMAGE_WIDTH}))`,
          transform: sceneTransform,
          transition: isInteracting ? "none" : "transform 180ms ease-out, filter 260ms ease-out",
          width: `max(100dvw, calc(100dvh * ${IMAGE_WIDTH / IMAGE_HEIGHT}))`,
        }}
      >
        <Image
          src="/images/plaza-piray.png"
          alt="Vista satelital pixel-art de la Plaza 9 de Julio de Puerto Piray"
          fill
          priority
          sizes="100vw"
          className="select-none object-cover [image-rendering:pixelated]"
          draggable={false}
        />
        <button
          type="button"
          aria-label="Entrar a Iglesia San Lorenzo"
          onClick={onEnterChurch}
          disabled={isEnteringChurch}
          className="hotspot-point group absolute z-[28] block -translate-x-1/2 -translate-y-1/2 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none"
          style={{ left: `${CHURCH_X}%`, top: `${CHURCH_Y}%`, width: "8%", height: "8%" }}
        >
          <span aria-hidden="true" className="hotspot-pulse" />
          <span aria-hidden="true" className="hotspot-dot" />
          <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-cyan-50 ring-1 ring-white/10 backdrop-blur sm:block">
            Iglesia San Lorenzo
          </span>
        </button>
        <FallingLeaves count={10} />
        <BirdFlock count={7} />
        <AmbientOverlay scene="plaza" />
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 bg-black transition-opacity duration-300 ${isEnteringChurch ? "opacity-25" : "opacity-0"}`}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-6">
        <div className="max-w-[calc(100vw-7rem)] rounded-md border border-white/10 bg-black/45 px-3 py-2 shadow-2xl backdrop-blur-md sm:px-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 sm:text-xs">Plaza 9 de Julio Digital</p>
          <p className="mt-1 text-xs font-semibold text-white/72 sm:text-sm">Arrastrá, acercá con dos dedos y tocá la iglesia.</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">
        <div className="pointer-events-auto mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-md border border-white/10 bg-black/50 p-1.5 shadow-2xl backdrop-blur-md sm:ml-auto sm:mr-0 sm:w-auto">
          <GameButton aria-label="Alejar mapa" onClick={() => zoomBy(-ZOOM_STEP)} disabled={scale <= MIN_SCALE + 0.01} className="flex-1 sm:flex-none">
            -
          </GameButton>
          <GameButton aria-label="Restablecer vista" onClick={resetView} className="flex-[1.3] sm:flex-none">
            1x
          </GameButton>
          <GameButton aria-label="Acercar mapa" onClick={() => zoomBy(ZOOM_STEP)} disabled={scale >= MAX_SCALE - 0.01} className="flex-1 sm:flex-none">
            +
          </GameButton>
        </div>
      </div>
    </section>
  );
}
