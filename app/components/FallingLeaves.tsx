type FallingLeavesProps = {
  count?: number;
};

const leafPattern = [
  { x: 4, delay: -1, duration: 9, size: 8, gust: false },
  { x: 12, delay: -6, duration: 12, size: 6, gust: true },
  { x: 19, delay: -3, duration: 10, size: 7, gust: false },
  { x: 27, delay: -9, duration: 14, size: 9, gust: true },
  { x: 36, delay: -4, duration: 11, size: 6, gust: false },
  { x: 45, delay: -11, duration: 15, size: 8, gust: true },
  { x: 53, delay: -7, duration: 12, size: 7, gust: false },
  { x: 61, delay: -2, duration: 16, size: 6, gust: true },
  { x: 68, delay: -12, duration: 10, size: 8, gust: false },
  { x: 74, delay: -5, duration: 13, size: 7, gust: true },
  { x: 82, delay: -10, duration: 11, size: 9, gust: false },
  { x: 91, delay: -8, duration: 15, size: 6, gust: true },
  { x: 97, delay: -13, duration: 12, size: 8, gust: false },
  { x: 6, delay: -15, duration: 17, size: 7, gust: true },
  { x: 33, delay: -16, duration: 14, size: 6, gust: true },
  { x: 86, delay: -18, duration: 16, size: 8, gust: true },
];

export function FallingLeaves({ count = 12 }: FallingLeavesProps) {
  return (
    <div aria-hidden="true" className="falling-leaves pointer-events-none absolute inset-0 z-[27] overflow-hidden">
      {leafPattern.slice(0, count).map((leaf, index) => (
        <span
          className={leaf.gust ? "leaf leaf-gust" : "leaf"}
          key={`${leaf.x}-${index}`}
          style={{
            left: `${leaf.x}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size + 3}px`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
