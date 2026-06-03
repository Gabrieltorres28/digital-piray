type SceneTransitionProps = {
  active: boolean;
  label?: string;
};

export function SceneTransition({ active, label }: SceneTransitionProps) {
  return (
    <div
      aria-hidden={!active}
      className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#050709] transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
    >
      <div className={`transition-all duration-500 ${active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
        <p className="rounded-md border border-cyan-100/20 bg-white/[0.04] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_42px_rgba(34,211,238,0.12)] backdrop-blur">
          {label ?? "Cargando escena"}
        </p>
      </div>
    </div>
  );
}
