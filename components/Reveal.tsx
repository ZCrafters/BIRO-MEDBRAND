"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveal: elemen masuk viewport → fade-up.
 * Pakai opacity/transform (bukan clip-path) karena IntersectionObserver
 * memperhitungkan clip-path dalam geometry — clip 100% = dianggap tidak
 * intersecting → deadlock (kartu tak pernah muncul).
 */
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** stagger antar kartu, ms */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible="false"
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
