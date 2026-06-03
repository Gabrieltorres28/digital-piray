"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { MAP_IMAGE, locations, type Location } from "../data/locations";
import { AmbientOverlay } from "./AmbientOverlay";
import { BirdFlock } from "./BirdFlock";
import { FallingLeaves } from "./FallingLeaves";
import { ZoomableImageScene, type ZoomableImageSceneHandle } from "./ZoomableImageScene";

type DigitalMapProps = {
  isTransitioning: boolean;
  targetLocation: Location | null;
  onSelectLocation: (location: Location) => void;
};

export function DigitalMap({ isTransitioning, targetLocation, onSelectLocation }: DigitalMapProps) {
  const mapRef = useRef<ZoomableImageSceneHandle>(null);

  function handleSelect(location: Location) {
    const hotspot = location.hotspotCoordinates;
    mapRef.current?.focusOn({ x: hotspot.x / 100, y: hotspot.y / 100, scale: 2.05 });
    onSelectLocation(location);
  }

  return (
    <section className="digital-experience-root relative h-[100dvh] w-screen overflow-hidden bg-[#050709] text-white selection:bg-cyan-200/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(45,212,191,0.16),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.7))]" />

      <motion.div
        className="absolute inset-0"
        animate={{ filter: isTransitioning ? "blur(7px) brightness(0.58) saturate(1.08)" : "blur(0px) brightness(1) saturate(1)" }}
        transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <ZoomableImageScene
          ref={mapRef}
          src={MAP_IMAGE.src}
          alt="Vista satelital pixel-art de la Plaza 9 de Julio de Puerto Piray"
          imageWidth={MAP_IMAGE.width}
          imageHeight={MAP_IMAGE.height}
          priority
          controlsLabel="Ver todo"
          maxScale={3.2}
          showControls={!isTransitioning}
        >
          {locations.map((location) => {
            const hotspot = location.hotspotCoordinates;
            return (
              <button
                key={location.id}
                type="button"
                aria-label={`Entrar a ${location.name}`}
                onClick={() => handleSelect(location)}
                disabled={isTransitioning}
                className="map-hotspot hotspot-point group absolute z-[28] block -translate-x-1/2 -translate-y-1/2 touch-manipulation rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.width}%`, height: `${hotspot.height}%` }}
              >
                <span aria-hidden="true" className="hotspot-pulse" />
                <span aria-hidden="true" className="hotspot-pin"><span className="hotspot-pin-core" /></span>
                <span className="hotspot-label">
                  {location.name}
                </span>
              </button>
            );
          })}
          <FallingLeaves count={10} />
          <BirdFlock count={7} />
          <AmbientOverlay scene="plaza" />
        </ZoomableImageScene>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-black"
        animate={{ opacity: isTransitioning ? 0.48 : 0 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-6"
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -8 : 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="max-w-[calc(100vw-1.5rem)] rounded-md border border-white/10 bg-black/45 px-3 py-2 shadow-2xl backdrop-blur-md sm:px-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 sm:text-xs">Plaza 9 de Julio Digital</p>
          <p className="mt-1 text-xs font-semibold text-white/72 sm:text-sm">
            {targetLocation ? `Entrando a ${targetLocation.name}` : "Arrastrá, acercá con dos dedos y tocá un edificio."}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
