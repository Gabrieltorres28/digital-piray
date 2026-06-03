import { TypewriterDialog } from "./TypewriterDialog";
import { ZoomableImageScene } from "./ZoomableImageScene";

type ChurchSceneProps = {
  isLeaving: boolean;
  onBack: () => void;
};

const churchMessages = [
  "Esta es la Iglesia San Lorenzo, uno de los puntos más reconocidos de Puerto Piray. Frente a la Plaza 9 de Julio, forma parte de la memoria urbana y espiritual del pueblo.",
  "Durante años, este lugar acompañó encuentros, celebraciones y momentos importantes de la comunidad.",
];

export function ChurchScene({ isLeaving, onBack }: ChurchSceneProps) {
  return (
    <section className="relative h-[100dvh] w-screen overflow-hidden bg-[#050709] text-white selection:bg-amber-200/25">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,221,156,0.14),transparent_34%),linear-gradient(180deg,rgba(5,7,9,0.2),rgba(5,7,9,0.88))]" />

      <ZoomableImageScene
        src="/images/iglesia-san-lorenzo.png"
        alt="Escena pixel-art de la Iglesia San Lorenzo de Puerto Piray"
        priority
        controlsLabel="Ver todo"
        maxScale={3.4}
        onBack={onBack}
        className={isLeaving ? "opacity-45" : "opacity-100"}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,transparent_42%,rgba(0,0,0,0.68)_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-6">
        <div className="w-fit max-w-[calc(100vw-1.5rem)] rounded-md border border-white/10 bg-black/45 px-3 py-2 shadow-2xl backdrop-blur-md sm:px-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100 sm:text-xs">Iglesia San Lorenzo</p>
          <p className="mt-1 text-xs font-semibold text-white/72 sm:text-sm">Puerto Piray, Misiones</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[4.8rem] z-40 px-3 sm:bottom-[5.5rem] sm:px-6">
        <div className="pointer-events-auto mx-auto max-w-3xl">
          <TypewriterDialog messages={churchMessages} />
        </div>
      </div>
    </section>
  );
}
