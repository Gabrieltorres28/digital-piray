"use client";

import { motion } from "framer-motion";
import type { Location } from "../data/locations";
import { TypewriterDialog } from "./TypewriterDialog";
import { ZoomableImageScene } from "./ZoomableImageScene";

type LocationSceneProps = {
  location: Location;
  isLeaving: boolean;
  onBack: () => void;
};

export function LocationScene({ location, isLeaving, onBack }: LocationSceneProps) {
  return (
    <section className="digital-experience-root relative h-[100dvh] w-screen overflow-hidden bg-[#050709] text-white selection:bg-amber-200/25">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,221,156,0.14),transparent_34%),linear-gradient(180deg,rgba(5,7,9,0.2),rgba(5,7,9,0.88))]" />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, filter: "blur(8px) brightness(0.72)" }}
        animate={{ opacity: isLeaving ? 0.45 : 1, filter: isLeaving ? "blur(5px) brightness(0.62)" : "blur(0px) brightness(1)" }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <ZoomableImageScene
          src={location.image}
          alt={`Escena pixel-art de ${location.name} de Puerto Piray`}
          imageWidth={location.imageWidth}
          imageHeight={location.imageHeight}
          priority
          controlsLabel="Ver todo"
          maxScale={3.4}
          onBack={onBack}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,transparent_42%,rgba(0,0,0,0.68)_100%)]" />

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: isLeaving ? 0 : 1, y: isLeaving ? -8 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="w-fit max-w-[calc(100vw-1.5rem)] rounded-md border border-white/10 bg-black/45 px-3 py-2 shadow-2xl backdrop-blur-md sm:px-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100 sm:text-xs">{location.name}</p>
          <p className="mt-1 text-xs font-semibold text-white/72 sm:text-sm">{location.subtitle}</p>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[4.8rem] z-40 px-3 sm:bottom-[5.5rem] sm:px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: isLeaving ? 0 : 1, y: isLeaving ? 16 : 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="pointer-events-auto mx-auto max-w-3xl">
          <TypewriterDialog key={location.id} messages={location.description} />
        </div>
      </motion.div>
    </section>
  );
}
