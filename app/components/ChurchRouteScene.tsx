"use client";

import { useRouter } from "next/navigation";
import { getLocation } from "../data/locations";
import { LocationScene } from "./LocationScene";

export function ChurchRouteScene() {
  const router = useRouter();
  const location = getLocation("iglesia");

  if (!location) {
    return null;
  }

  return <LocationScene location={location} isLeaving={false} onBack={() => router.push("/")} />;
}
