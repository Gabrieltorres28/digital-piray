import Link from "next/link";

type HotspotProps = {
  href: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export function Hotspot({ href, label, x, y, width = 7, height = 7 }: HotspotProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="hotspot-point group absolute z-[28] block focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <span aria-hidden="true" className="hotspot-pulse" />
      <span aria-hidden="true" className="hotspot-dot" />
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-cyan-50 ring-1 ring-white/10 backdrop-blur sm:block">
        {label}
      </span>
    </Link>
  );
}
