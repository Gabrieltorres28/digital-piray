type AmbientOverlayProps = {
  scene?: "plaza" | "iglesia";
};

export function AmbientOverlay({ scene = "plaza" }: AmbientOverlayProps) {
  return <div aria-hidden="true" className={`ambient-overlay pointer-events-none absolute inset-0 z-[25] ${scene}`} />;
}
