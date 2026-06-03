import Image from "next/image";
import { GameButton } from "./GameButton";
import { TypewriterDialog } from "./TypewriterDialog";

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
    <section className="relative min-h-dvh overflow-hidden bg-[#050709] text-white">
      <Image
        src="/images/iglesia-san-lorenzo.png"
        alt="Escena pixel-art de la Iglesia San Lorenzo de Puerto Piray"
        fill
        priority
        sizes="100vw"
        className={`select-none object-contain object-center [image-rendering:pixelated] transition-opacity duration-300 ${
          isLeaving ? "opacity-45" : "opacity-100"
        }`}
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,transparent_42%,rgba(0,0,0,0.68)_100%)]" />

      <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-6">
        <div className="rounded-md border border-white/10 bg-black/45 px-3 py-2 shadow-2xl backdrop-blur-md sm:px-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100 sm:text-xs">Iglesia San Lorenzo</p>
          <p className="mt-1 text-xs font-semibold text-white/72 sm:text-sm">Puerto Piray, Misiones</p>
        </div>
        <GameButton onClick={onBack} disabled={isLeaving} className="bg-black/60">
          Volver
        </GameButton>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">
        <div className="mx-auto max-w-3xl">
          <TypewriterDialog messages={churchMessages} />
        </div>
      </div>
    </section>
  );
}
