"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
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

type ViewportSize = {
  width: number;
  height: number;
};

const IMAGE_WIDTH = 1672;
const IMAGE_HEIGHT = 941;

function getViewportSize(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
  };
}

function centeredPosition(viewport: ViewportSize, scale: number) {
  return {
    x: (viewport.width - IMAGE_WIDTH * scale) / 2,
    y: (viewport.height - IMAGE_HEIGHT * scale) / 2,
  };
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

  const camera = useMemo(() => {
    if (viewport.width <= 0 || viewport.height <= 0) {
      return {
        coverScale: 1,
        fitScale: 1,
        initialX: 0,
        initialY: 0,
      };
    }

    const fitScale = Math.min(viewport.width / IMAGE_WIDTH, viewport.height / IMAGE_HEIGHT);
    const coverScale = Math.max(viewport.width / IMAGE_WIDTH, viewport.height / IMAGE_HEIGHT);
    const initial = centeredPosition(viewport, coverScale);

    return {
      coverScale,
      fitScale,
      initialX: initial.x,
      initialY: initial.y,
    };
  }, [viewport.height, viewport.width]);

  const isReady = viewport.width > 0 && viewport.height > 0;
  const resetKey = `${viewport.width}-${viewport.height}-${camera.coverScale.toFixed(3)}`;

  return (
    <div className="absolute inset-0 h-[100dvh] w-screen overflow-hidden touch-none select-none">
      {isReady ? (
        <TransformWrapper
          key={resetKey}
          centerOnInit={false}
          centerZoomedOut
          disablePadding
          initialPositionX={camera.initialX}
          initialPositionY={camera.initialY}
          initialScale={camera.coverScale}
          limitToBounds
          maxScale={Math.max(maxScale, camera.coverScale)}
          minScale={camera.fitScale}
          pinch={{ disabled: false, step: 8 }}
          panning={{ allowLeftClickPan: true, velocityDisabled: true, excluded: [".zoom-control", ".map-hotspot"] }}
          wheel={{ step: 0.12 }}
          doubleClick={{ disabled: true, excluded: [".zoom-control", ".map-hotspot"] }}
        >
          {({ zoomIn, zoomOut, setTransform }) => {
            const showAll = () => {
              const next = centeredPosition(viewport, camera.fitScale);
              setTransform(next.x, next.y, camera.fitScale, 220);
            };

            return (
              <>
                <TransformComponent
                  wrapperClass="!absolute !inset-0 !h-[100dvh] !w-screen touch-none select-none"
                  contentClass="touch-none select-none"
                  wrapperStyle={{ touchAction: "none" }}
                  contentStyle={{ height: `${IMAGE_HEIGHT}px`, maxWidth: "none", touchAction: "none", width: `${IMAGE_WIDTH}px` }}
                >
                  <div
                    className={`relative h-[941px] w-[1672px] max-w-none touch-none select-none ${className}`}
                    style={{ maxWidth: "none" }}
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
                </TransformComponent>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">
                  <div className="zoom-control pointer-events-auto mx-auto flex w-full max-w-md items-center justify-center gap-1.5 rounded-md border border-white/10 bg-black/58 p-1.5 shadow-2xl backdrop-blur-md sm:ml-auto sm:mr-0 sm:w-auto sm:gap-2">
                    {onBack ? (
                      <GameButton aria-label="Volver" onClick={onBack} className="flex-[1.2] px-2 sm:flex-none sm:px-4">
                        Back
                      </GameButton>
                    ) : null}
                    <GameButton aria-label="Alejar" onClick={() => zoomOut(0.45)} className="flex-1 px-2 sm:flex-none sm:px-4">
                      -
                    </GameButton>
                    <GameButton aria-label="Ver todo" onClick={showAll} className="flex-[1.7] px-2 sm:flex-none sm:px-4">
                      {controlsLabel}
                    </GameButton>
                    <GameButton aria-label="Acercar" onClick={() => zoomIn(0.45)} className="flex-1 px-2 sm:flex-none sm:px-4">
                      +
                    </GameButton>
                  </div>
                </div>
              </>
            );
          }}
        </TransformWrapper>
      ) : null}
    </div>
  );
}
