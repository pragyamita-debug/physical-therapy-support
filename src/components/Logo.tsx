/** Leaf with a rising sun behind it — the brand mark used in the nav, footer and upload screen. */
export function Logo({ size = 34, light = false }: { size?: number; light?: boolean }) {
  const leaf = light ? '#ffffff' : 'var(--forest)';
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <circle className="logo__sun" cx="25" cy="13" r="6" fill="var(--warm)" />
      <path d="M7 33c1-12 8-20 22-22-1 13-9 21-22 22Z" fill={leaf} />
      <path d="M8 32c5-7 10-11 17-15" stroke={light ? 'var(--forest)' : '#fff'} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M5 21c4 .5 7 3 8 7" stroke="var(--accent-soft)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
