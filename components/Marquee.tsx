const ITEMS = ["MEDIA", "BRANDING", "VISUAL", "KOLABORASI", "DESAIN", "KONTEN"];

/** Marquee divider — CSS murni, loop linear infinite, mask fade di tepi. */
export default function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 text-[15px] font-medium tracking-[0.18em] opacity-70">
            {item}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-30" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="marquee-mask overflow-hidden border-y border-black/10 bg-[#fbe2ee] py-3"
    >
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
