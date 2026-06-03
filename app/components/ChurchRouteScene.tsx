"use client";

import { useRouter } from "next/navigation";
import { ChurchScene } from "./ChurchScene";

export function ChurchRouteScene() {
  const router = useRouter();

  return <ChurchScene isLeaving={false} onBack={() => router.push("/")} />;
}
