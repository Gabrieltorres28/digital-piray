import { AmbientOverlay } from "./AmbientOverlay";
import { BirdFlock } from "./BirdFlock";
import { FallingLeaves } from "./FallingLeaves";
import { ZoomableImageScene } from "./ZoomableImageScene";

type DigitalMapProps = {
  isEnteringChurch: boolean;
  onEnterChurch: () => void;
};

const CHURCH_X = 35.7;
const CHURCH_Y = 27.5;

export function DigitalMap({ isEnteringChurch, onEnterChurch }: DigitalMapProps) {
  return (
    <section className="relative h-[100dvh] w-screen overflow-hidden bg-[#050709] text-white selection:bg-cyan-200/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(45,212,191,0.16),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.7))]" />

      <ZoomableImageScene
        src="/images/plaza-piray.png"
        alt="Vista satelital pixel-art de la Plaza 9 de Julio de Puerto Piray"
        priority
        controlsLabel="Ver todo"
        maxScale={3.2}
        className={isEnteringChurch ? "brightness-75 saturate-105" : ""}
      >
        <button
          type="button"
          aria-label="Entrar a Iglesia San Lorenzo"
          onClick={onEnterChurch}
          disabled={isEnteringChurch}
          className="map-hotspot hotspot-point group absolute z-[28] block -translate-x-1/2 -translate-y-1/2 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none"
          style={{ left: `${CHURCH_X}%`, top: `${CHURCH_Y}%`, width: "8%", height: "8%" }}
        >
          <span aria-hidden="true" className="hotspot-pulse" />
          <span aria-hidden="true" className="hotspot-dot" />
          <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-cyan-50 ring-1 ring-white/10 backdrop-blur sm:block">
            Iglesia San Lorenzo
          </span>
        </button>
        <FallingLeaves count={10} />
        <BirdFlock count={7} />
        <AmbientOverlay scene="plaza" />
      </ZoomableImageScene>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 bg-black transition-opacity duration-300 ${isEnteringChurch ? "opacity-25" : "opacity-0"}`}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-6">
        <div className="max-w-[calc(100vw-7rem)] rounded-md border border-white/10 bg-black/45 px-3 py-2 shadow-2xl backdrop-blur-md sm:px-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 sm:text-xs">Plaza 9 de Julio Digital</p>
          <p className="mt-1 text-xs font-semibold text-white/72 sm:text-sm">Arrastrá, acercá con dos dedos y tocá la iglesia.</p>
        </div>
      </div>
    </section>
  );
}
