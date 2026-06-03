import { GameButton } from "./GameButton";

type IntroScreenProps = {
  onStart: () => void;
};

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="digital-experience-root relative min-h-dvh overflow-hidden bg-[#050709] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,12,0.2),rgba(4,7,10,0.86)),radial-gradient(circle_at_50%_28%,rgba(95,178,189,0.18),transparent_34%),radial-gradient(circle_at_50%_88%,rgba(214,151,58,0.18),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/40 to-transparent" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <p className="mb-4 rounded-md border border-cyan-100/18 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.1)] backdrop-blur sm:text-xs">
            Recorrido interactivo
          </p>
          <h1 className="max-w-[13ch] text-balance text-4xl font-black leading-[0.98] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:max-w-none sm:text-6xl lg:text-7xl">
            Plaza 9 de Julio Digital
          </h1>
          <p className="mt-4 text-base font-semibold uppercase tracking-[0.18em] text-cyan-50/82 sm:text-lg">
            Puerto Piray, Misiones
          </p>
          <div className="mt-7 h-px w-32 bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
          <p className="mt-7 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
            Explorá un punto central de la memoria urbana de Puerto Piray con una experiencia visual pensada para recorrer, tocar y descubrir.
          </p>
          <GameButton
            onClick={onStart}
            className="mt-8 h-12 min-w-[12rem] border-amber-100/35 bg-amber-100/12 px-6 text-sm text-amber-50 shadow-[0_0_42px_rgba(245,190,95,0.16)] hover:border-amber-100/70 hover:bg-amber-100/18 sm:h-14 sm:min-w-[14rem]"
          >
            Iniciar recorrido
          </GameButton>
        </div>
      </div>
    </section>
  );
}
