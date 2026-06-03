"use client";

import Image from "next/image";
import type { PointerEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { GameButton } from "./GameButton";

type ZoomableImageSceneProps = {
  src: string;
  alt: string;
  children?: ReactNode;
  className?: string;
  controlsLabel?: string;
  maxScale?: number;
  onBack?: () => void;
  priority?: boolean;
};

type Point = {
  x: number;
  y: number;
};

type CameraState = {
  x: number;
  y: number;
  scale: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

const IMAGE_WIDTH = 1672;
const IMAGE_HEIGHT = 941;
const ZOOM_STEP = 0.22;

function getViewportSize(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
  };
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function centeredPosition(viewport: ViewportSize, scale: number) {
  return {
    x: (viewport.width - IMAGE_WIDTH * scale) / 2,
    y: (viewport.height - IMAGE_HEIGHT * scale) / 2,
  };
}

function clampCamera(camera: CameraState, viewport: ViewportSize): CameraState {
  const scaledWidth = IMAGE_WIDTH * camera.scale;
  const scaledHeight = IMAGE_HEIGHT * camera.scale;
  const minX = Math.min(0, viewport.width - scaledWidth);
  const maxX = Math.max(0, viewport.width - scaledWidth);
  const minY = Math.min(0, viewport.height - scaledHeight);
  const maxY = Math.max(0, viewport.height - scaledHeight);

  return {
    scale: camera.scale,
    x: scaledWidth <= viewport.width ? (viewport.width - scaledWidth) / 2 : clamp(camera.x, minX, maxX),
    y: scaledHeight <= viewport.height ? (viewport.height - scaledHeight) / 2 : clamp(camera.y, minY, maxY),
  };
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(".zoom-control, .map-hotspot, button, a"));
}

export function ZoomableImageScene({
  src,
  alt,
  children,
  className = "",
  controlsLabel = "Ver todo",
  maxScale = 3,
  onBack,
  priority = false,
}: ZoomableImageSceneProps) {
  const [viewport, setViewport] = useState<ViewportSize>({ width: 0, height: 0 });
  const [camera, setCamera] = useState<CameraState>({ scale: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const lastPanPoint = useRef<Point | null>(null);
  const lastPinch = useRef<{ distance: number; midpoint: Point } | null>(null);

  useEffect(() => {
    const updateViewport = () => setViewport(getViewportSize());

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  const scales = useMemo(() => {
    if (viewport.width <= 0 || viewport.height <= 0) {
      return { cover: 1, fit: 1, max: maxScale };
    }

    const fit = Math.min(viewport.width / IMAGE_WIDTH, viewport.height / IMAGE_HEIGHT);
    const cover = Math.max(viewport.width / IMAGE_WIDTH, viewport.height / IMAGE_HEIGHT);

    return {
      cover,
      fit,
      max: Math.max(maxScale, cover),
    };
  }, [maxScale, viewport.height, viewport.width]);

  useEffect(() => {
    if (viewport.width <= 0 || viewport.height <= 0) {
      return;
    }

    const initial = centeredPosition(viewport, scales.cover);
    setCamera({ scale: scales.cover, x: initial.x, y: initial.y });
  }, [scales.cover, viewport.height, viewport.width]);

  function setClampedCamera(nextCamera: CameraState) {
    setCamera(clampCamera({ ...nextCamera, scale: clamp(nextCamera.scale, scales.fit, scales.max) }, viewport));
  }

  function showAll() {
    const next = centeredPosition(viewport, scales.fit);
    setCamera({ scale: scales.fit, x: next.x, y: next.y });
  }

  function zoomBy(delta: number) {
    const nextScale = clamp(camera.scale + delta, scales.fit, scales.max);
    const center = { x: viewport.width / 2, y: viewport.height / 2 };
    const ratio = nextScale / camera.scale;

    setClampedCamera({
      scale: nextScale,
      x: center.x - (center.x - camera.x) * ratio,
      y: center.y - (center.y - camera.y) * ratio,
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isInteractiveTarget(event.target)) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);
    lastPanPoint.current = point;

    if (pointers.current.size === 2) {
      const [first, second] = Array.from(pointers.current.values());
      lastPinch.current = { distance: distance(first, second), midpoint: midpoint(first, second) };
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) {
      return;
    }

    event.preventDefault();
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size >= 2) {
      const [first, second] = Array.from(pointers.current.values());
      const nextDistance = distance(first, second);
      const nextMidpoint = midpoint(first, second);
      const previous = lastPinch.current ?? { distance: nextDistance, midpoint: nextMidpoint };
      const nextScale = clamp(camera.scale * (nextDistance / previous.distance), scales.fit, scales.max);
      const ratio = nextScale / camera.scale;

      setClampedCamera({
        scale: nextScale,
        x: nextMidpoint.x - (previous.midpoint.x - camera.x) * ratio,
        y: nextMidpoint.y - (previous.midpoint.y - camera.y) * ratio,
      });
      lastPinch.current = { distance: nextDistance, midpoint: nextMidpoint };
      return;
    }

    if (lastPanPoint.current) {
      const dx = point.x - lastPanPoint.current.x;
      const dy = point.y - lastPanPoint.current.y;
      setClampedCamera({ scale: camera.scale, x: camera.x + dx, y: camera.y + dy });
    }

    lastPanPoint.current = point;
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    lastPinch.current = null;
    lastPanPoint.current = pointers.current.size === 1 ? Array.from(pointers.current.values())[0] : null;
  }

  return (
    <div className="absolute inset-0 h-[100dvh] w-screen overflow-hidden touch-none select-none">
      <TransformWrapper disabled>
        <TransformComponent wrapperClass="!hidden" contentClass="!hidden">
          <span />
        </TransformComponent>
      </TransformWrapper>

      <div
        className="absolute inset-0 z-10 h-[100dvh] w-screen cursor-grab touch-none select-none active:cursor-grabbing"
        onContextMenu={(event) => event.preventDefault()}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        style={{ touchAction: "none" }}
      >
        <div
          className={`absolute left-0 top-0 h-[941px] w-[1672px] max-w-none touch-none select-none will-change-transform ${className}`}
          style={{ transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`, transformOrigin: "0 0" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="pointer-events-none select-none object-contain [image-rendering:pixelated]"
            draggable={false}
          />
          {children}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">
        <div className="zoom-control pointer-events-auto mx-auto flex w-full max-w-md items-center justify-center gap-1.5 rounded-md border border-white/10 bg-black/58 p-1.5 shadow-2xl backdrop-blur-md sm:ml-auto sm:mr-0 sm:w-auto sm:gap-2">
          {onBack ? (
            <GameButton aria-label="Volver" onClick={onBack} className="flex-[1.2] px-2 sm:flex-none sm:px-4">
              Back
            </GameButton>
          ) : null}
          <GameButton aria-label="Alejar" onClick={() => zoomBy(-ZOOM_STEP)} className="flex-1 px-2 sm:flex-none sm:px-4">
            -
          </GameButton>
          <GameButton aria-label="Ver todo" onClick={showAll} className="flex-[1.7] px-2 sm:flex-none sm:px-4">
            {controlsLabel}
          </GameButton>
          <GameButton aria-label="Acercar" onClick={() => zoomBy(ZOOM_STEP)} className="flex-1 px-2 sm:flex-none sm:px-4">
            +
          </GameButton>
        </div>
      </div>
    </div>
  );
}
