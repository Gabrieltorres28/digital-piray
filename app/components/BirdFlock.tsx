import type { CSSProperties } from "react";

type BirdFlockProps = {
  count?: number;
};

const birds = [
  { top: 24, left: 8, delay: -4, duration: 17, scale: 1.45 },
  { top: 30, left: 20, delay: -8, duration: 19, scale: 1.15 },
  { top: 38, left: 34, delay: -12, duration: 18, scale: 1.32 },
  { top: 45, left: 50, delay: -15, duration: 21, scale: 1.05 },
  { top: 52, left: 66, delay: -18, duration: 20, scale: 1.22 },
  { top: 34, left: 80, delay: -10, duration: 23, scale: 0.95 },
  { top: 28, left: 44, delay: -2, duration: 16, scale: 1.08 },
];

export function BirdFlock({ count = 7 }: BirdFlockProps) {
  return (
    <div aria-hidden="true" className="bird-flock pointer-events-none absolute inset-0 z-[31] overflow-hidden">
      {birds.slice(0, count).map((bird, index) => (
        <span
          className="bird"
          key={`${bird.top}-${bird.left}-${index}`}
          style={{
            left: `${bird.left}%`,
            top: `${bird.top}%`,
            animationDelay: `${bird.delay}s`,
            animationDuration: `${bird.duration}s`,
            "--bird-scale": bird.scale,
          } as CSSProperties}
        >
          <span className="bird-body" />
          <span className="bird-wing bird-wing-left" />
          <span className="bird-wing bird-wing-right" />
        </span>
      ))}
    </div>
  );
}
