"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Location } from "../data/locations";
import { DigitalMap } from "./DigitalMap";
import { IntroScreen } from "./IntroScreen";
import { LocationScene } from "./LocationScene";
import { SceneTransition } from "./SceneTransition";

type ExperienceScene = "intro" | "map" | "location";

const ENTER_TRANSITION_MS = 900;
const EXIT_TRANSITION_MS = 520;

export function DigitalExperience() {
  const [scene, setScene] = useState<ExperienceScene>("intro");
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [targetLocation, setTargetLocation] = useState<Location | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLeavingLocation, setIsLeavingLocation] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const sceneImages = [
      "/images/iglesia-san-lorenzo.png",
      "/images/centro-cultural.png",
      "/images/municipalidad.png",
      "/images/concejo-deliberante.png",
      "/images/polideportivo.png",
    ];

    sceneImages.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    return () => timers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function startMap() {
    setScene("map");
  }

  function enterLocation(location: Location) {
    if (isTransitioning) return;
    setTargetLocation(location);
    setIsTransitioning(true);
    schedule(() => {
      setActiveLocation(location);
      setScene("location");
      setIsTransitioning(false);
      setTargetLocation(null);
    }, ENTER_TRANSITION_MS);
  }

  function returnToMap() {
    if (isTransitioning || isLeavingLocation) return;
    setIsLeavingLocation(true);
    setIsTransitioning(true);
    schedule(() => {
      setScene("map");
      setIsLeavingLocation(false);
      setIsTransitioning(false);
    }, EXIT_TRANSITION_MS);
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {scene === "intro" ? <IntroScreen key="intro" onStart={startMap} /> : null}
        {scene === "map" ? (
          <DigitalMap key="map" isTransitioning={isTransitioning} targetLocation={targetLocation} onSelectLocation={enterLocation} />
        ) : null}
        {scene === "location" && activeLocation ? (
          <LocationScene key={activeLocation.id} location={activeLocation} isLeaving={isLeavingLocation} onBack={returnToMap} />
        ) : null}
      </AnimatePresence>
      <SceneTransition active={isTransitioning} label={targetLocation ? `Entrando a ${targetLocation.name}` : "Volviendo al mapa"} />
    </>
  );
}
