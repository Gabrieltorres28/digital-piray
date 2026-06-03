"use client";

import Image from "next/image";
import type { PointerEvent, ReactNode, WheelEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { GameButton } from "./GameButton";

type SceneViewerProps = {
  src: string;
  alt: string;
  children?: ReactNode;
  instruction?: string;
  title?: string;
  overlay?: "light" | "dark";
  enablePan?: boolean;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  priority?: boolean;
  topLeftControls?: ReactNode;
};

type Point = {
  x: number;
  y: number;
};

const IMAGE_WIDTH = 1672;
const IMAGE_HEIGHT = 941;
const ZOOM_STEP = 0.16;

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, [role=button]"));
}

export function SceneViewer({
  src,
  alt,
  children,
  instruction,
  title,
  overlay = "dark",
  enablePan = true,
  minScale = 1,
  maxScale = 2.4,
  initialScale = 1,
  priority = false,
  topLeftControls,
}: SceneViewerProps) {
  const [scale, setScale] = useState(initialScale);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const pointers = useRef(new Map<number, Point>());
  const lastPanPoint = useRef<Point | null>(null);
  const lastPinch = useRef<number | null>(null);

  const setClampedScale = useCallback(
    (nextScale: number) => {
      setScale(clamp(nextScale, minScale, maxScale));
    },
    [maxScale, minScale],
  );

  const zoomBy = useCallback(
    (delta: number) => {
      setClampedScale(scale + delta);
    },
    [scale, setClampedScale],
  );

  const resetView = useCallback(() => {
    setScale(initialScale);
    setOffset({ x: 0, y: 0 });
  }, [initialScale]);

  const sceneTransform = useMemo(
    () => `translate(-50%, -50%) translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
    [offset.x, offset.y, scale],
  );

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      setClampedScale(scale + (event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP));
    },
    [scale, setClampedScale],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!enablePan || isInteractiveTarget(event.target)) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      const point = { x: event.clientX, y: event.clientY };
      pointers.current.set(event.pointerId, point);
      setIsInteracting(true);
      lastPanPoint.current = point;

      if (pointers.current.size === 2) {
        const [first, second] = Array.from(pointers.current.values());
        lastPinch.current = distance(first, second);
      }
    },
    [enablePan],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!enablePan || !pointers.current.has(event.pointerId)) {
        return;
      }

      const point = { x: event.clientX, y: event.clientY };
      pointers.current.set(event.pointerId, point);

      if (pointers.current.size === 2) {
        const [first, second] = Array.from(pointers.current.values());
        const nextPinch = distance(first, second);
        const previousPinch = lastPinch.current ?? nextPinch;
        const pinchDelta = (nextPinch - previousPinch) / 260;
        lastPinch.current = nextPinch;
        setScale((current) => clamp(current + pinchDelta, minScale, maxScale));
        return;
      }

      if (lastPanPoint.current && scale > minScale) {
        const dx = point.x - lastPanPoint.current.x;
        const dy = point.y - lastPanPoint.current.y;
        setOffset((current) => ({ x: current.x + dx, y: current.y + dy }));
      }

      lastPanPoint.current = point;
    },
    [enablePan, maxScale, minScale, scale],
  );

  const handlePointerEnd = useCallback((event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    lastPinch.current = null;
    setIsInteracting(pointers.current.size > 0);
    lastPanPoint.current = pointers.current.size === 1 ? Array.from(pointers.current.values())[0] : null;
  }, []);

  return (
    <main
      className="relative min-h-dvh w-full overflow-hidden bg-[#050709] text-white selection:bg-cyan-200/30"
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
          height: `max(100dvh, calc(100dvw * ${IMAGE_HEIGHT / IMAGE_WIDTH}))`,
          transform: sceneTransform,
          transition: isInteracting ? "none" : "transform 180ms ease-out",
          width: `max(100dvw, calc(100dvh * ${IMAGE_WIDTH / IMAGE_HEIGHT}))`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="select-none object-cover [image-rendering:pixelated]"
          draggable={false}
        />
        {children}
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${
          overlay === "dark" ? "bg-black/20" : "bg-black/10"
        } shadow-[inset_0_0_120px_rgba(0,0,0,0.72)]`}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-3 sm:gap-3 sm:p-6">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">{topLeftControls}</div>
        <div className="pointer-events-auto flex items-center gap-1 rounded-md border border-white/10 bg-black/45 p-1 sm:gap-2 sm:p-1.5 shadow-2xl backdrop-blur-md">
          <GameButton aria-label="Alejar" onClick={() => zoomBy(-ZOOM_STEP)} disabled={scale <= minScale + 0.01}>
            -
          </GameButton>
          <GameButton aria-label="Acercar" onClick={() => zoomBy(ZOOM_STEP)} disabled={scale >= maxScale - 0.01}>
            +
          </GameButton>
          <GameButton aria-label="Centrar vista" onClick={resetView} className="hidden sm:inline-flex">
            1x
          </GameButton>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="mx-auto flex max-w-[min(42rem,calc(100vw-1.5rem))] flex-col items-center gap-2 text-center">
          {title ? (
            <p className="rounded-md border border-white/10 bg-black/45 px-2.5 py-1 font-mono text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 shadow-2xl backdrop-blur">
              {title}
            </p>
          ) : null}
          {instruction ? (
            <p className="rounded-md border border-cyan-200/20 bg-black/55 px-3 py-2 text-xs leading-snug sm:px-4 sm:text-sm font-semibold text-cyan-50 shadow-2xl backdrop-blur sm:text-base">
              {instruction}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
