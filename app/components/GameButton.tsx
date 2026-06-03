import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type GameButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
};

const baseClass =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-cyan-200/25 bg-black/55 px-3 text-xs sm:h-11 sm:min-w-11 sm:px-4 sm:text-sm font-bold uppercase tracking-[0.08em] text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur transition hover:border-cyan-200/60 hover:bg-cyan-200/15 focus:outline-none focus:ring-2 focus:ring-cyan-200/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

export function GameButton({ children, className = "", href, ...props }: GameButtonProps) {
  const composedClassName = `${baseClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={composedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={composedClassName} type="button" {...props}>
      {children}
    </button>
  );
}
