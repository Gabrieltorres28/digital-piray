"use client";

import { useEffect, useRef, useState } from "react";
import { ChurchScene } from "./ChurchScene";
import { DigitalMap } from "./DigitalMap";
import { IntroScreen } from "./IntroScreen";
import { SceneTransition } from "./SceneTransition";

type ExperienceScene = "intro" | "map" | "church";

export function DigitalExperience() {
  const [scene, setScene] = useState<ExperienceScene>("intro");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLeavingChurch, setIsLeavingChurch] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function startMap() {
    setScene("map");
  }

  function enterChurch() {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);
    schedule(() => {
      setScene("church");
      setIsTransitioning(false);
    }, 360);
  }

  function returnToMap() {
    if (isTransitioning || isLeavingChurch) {
      return;
    }

    setIsLeavingChurch(true);
    setIsTransitioning(true);
    schedule(() => {
      setScene("map");
      setIsLeavingChurch(false);
      setIsTransitioning(false);
    }, 360);
  }

  return (
    <>
      {scene === "intro" ? <IntroScreen onStart={startMap} /> : null}
      {scene === "map" ? <DigitalMap isEnteringChurch={false} onEnterChurch={enterChurch} /> : null}
      {scene === "church" ? <ChurchScene isLeaving={isLeavingChurch} onBack={returnToMap} /> : null}
      <SceneTransition active={isTransitioning} label={scene === "church" ? "Volviendo al mapa" : "Entrando a la iglesia"} />
    </>
  );
}
