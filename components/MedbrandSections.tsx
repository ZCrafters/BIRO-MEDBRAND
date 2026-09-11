"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "motion/react";
import { cn } from "@/lib/cn";
import { DEFAULT_TODOS, LINKS, MEMBERS } from "@/lib/site";
import Reveal from "./Reveal";
import Marquee from "./Marquee";

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // set pada elemen kartu itu sendiri — bukan via parent CSS var
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        "spotlight pressable rounded-3xl border border-black/10 bg-[#f7f8fa] p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg md:p-7",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[30px] items-center whitespace-nowrap rounded-full bg-[#080909] px-3 text-sm text-[#f7f8fa]">
      {children}
    </span>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-grotesk mt-4 text-[22px] font-bold leading-[1.2]">
      {children}
    </h3>
  );
}

function OpenButton({ href, label }: { href: string; label: string }) {
  if (href === "#") {
    return (
      <span className="mt-5 inline-flex h-11 cursor-not-allowed items-center rounded-full border border-dashed border-black/25 bg-[#f7f8fa] px-5 text-[15px] font-medium opacity-50">
        Link belum tersedia
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="pressable mt-5 inline-flex h-11 items-center rounded-full bg-[#080909] px-5 text-[15px] font-medium text-white"
    >
      {label} →
    </a>
  );
}

function TodoBox() {
  const [todos, setTodos] = useState(DEFAULT_TODOS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("medbrand-todos");
      if (raw) setTodos(JSON.parse(raw));
    } catch {
      /* abaikan, pakai default */
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("medbrand-todos", JSON.stringify(todos));
    } catch {
      /* storage penuh / private mode */
    }
  }, [todos, loaded]);

  const done = todos.filter((t) => t.done).length;
  const pct = done / todos.length;

  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardTag>04 — checklist</CardTag>
      <CardTitle>To Do List Design</CardTitle>
      <p className="mt-2 text-[15px] leading-relaxed opacity-70">
        {done}/{todos.length} selesai • tersimpan otomatis di browser
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
        {/* scaleX (GPU) — origin kiri supaya terbaca sebagai progress */}
        <div
          className="h-full origin-left rounded-full bg-[#080909] transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${pct})` }}
        />
      </div>
      <ul className="mt-4 space-y-1">
        {todos.map((t) => (
          <li key={t.id}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 transition-colors duration-150 ease-out hover:bg-black/5">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() =>
                  setTodos((prev) =>
                    prev.map((p) =>
                      p.id === t.id ? { ...p, done: !p.done } : p
                    )
                  )
                }
                className="mt-1 h-4 w-4 shrink-0 accent-black"
              />
              <span
                className={cn(
                  "text-[15px] leading-snug",
                  t.done && "opacity-50 line-through"
                )}
              >
                {t.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setTodos(DEFAULT_TODOS)}
        className="pressable mt-3 text-sm underline underline-offset-4 opacity-60 hover:opacity-100"
      >
        Reset checklist
      </button>
    </Card>
  );
}

/** Blob lavender yang mengikuti kursor dengan spring — dekoratif, hero saja. */
function HeroBlobs() {
  const mx = useSpring(0, { stiffness: 100, damping: 10 });
  const my = useSpring(0, { stiffness: 100, damping: 10 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 3;
      mx.set((e.clientX - cx) * 0.05);
      my.set((e.clientY - cy) * 0.05);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="blob left-[12%] top-[8%] h-[26vw] w-[26vw] bg-[#c7d0ee]"
        style={{ x: mx, y: my }}
      />
      <motion.div
        className="blob left-[68%] top-[34%] h-[30vw] w-[30vw] bg-[#dcd2ef]"
        style={{ x: mx, y: my, rotate: 0 }}
      />
    </div>
  );
}

export default function MedbrandSections() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <header className="relative overflow-hidden px-6 pt-20 pb-14 md:px-[8.65vw] md:pt-28 md:pb-20">
        <HeroBlobs />
        <div className="relative">
          <span className="enter enter-1 inline-flex h-[30px] items-center rounded-full bg-[#f7f8fa] px-3 text-sm">
            Paguyuban Karya Salemba Empat • IPB
          </span>
          <h1 className="font-grotesk enter enter-2 mt-5 max-w-4xl text-[clamp(32px,6vw,72px)] font-bold leading-[1.05] tracking-tight">
            Biro Medbrand
            <br />
            Paguyuban Karya
            <br />
            Salemba Empat IPB
          </h1>
          <p className="enter enter-3 mt-5 max-w-xl text-[16px] leading-relaxed opacity-70 md:text-lg">
            Wadah kreatif untuk media, branding, dan visual. Semua arsip —
            moodboard, anggota, COPM, checklist, sampai hasil design — terpusat
            di satu landing page ini.
          </p>
          <div className="enter enter-4 mt-7 flex flex-wrap gap-3">
            <a
              href="#about"
              className="pressable inline-flex h-12 items-center rounded-full bg-[#080909] px-6 text-[15px] font-medium text-white"
            >
              Lihat About Us ↓
            </a>
            <a
              href="#kotak"
              className="pressable inline-flex h-12 items-center rounded-full border border-black/15 bg-[#f7f8fa] px-6 text-[15px] font-medium"
            >
              Lompat ke 5 kotak
            </a>
          </div>
        </div>
      </header>

      {/* ---------- MARQUEE DIVIDER ---------- */}
      <Marquee />

      {/* ---------- ABOUT US ---------- */}
      <section id="about" className="scroll-mt-20 px-6 pt-14 md:px-[8.65vw] md:pt-20">
        <Reveal>
          <div className="rounded-3xl border border-black/10 bg-[#f0eefa] p-6 md:p-10">
            <span className="inline-flex h-[30px] items-center rounded-full bg-[#f7f8fa] px-3 text-sm">
              about us
            </span>
            <h2 className="font-grotesk mt-4 text-[clamp(24px,3.4vw,40px)] font-bold leading-tight">
              Imagination meets craft — versi Medbrand.
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed opacity-75 md:text-[17px]">
              Biro Media &amp; Branding (Medbrand) adalah tim di balik identitas
              visual Paguyuban KSE IPB: dari konten media sosial, dokumentasi
              kegiatan, sampai sistem branding yang konsisten. Halaman ini jadi
              hub kerja kami — mau lihat referensi, kenalan sama tim, cek progres,
              atau ambil file final, semuanya tinggal klik kotak di bawah.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Media", "Konten, publikasi & dokumentasi"],
                ["Branding", "Visual identity yang konsisten"],
                ["Kolaborasi", "Satu hub, semua tim terhubung"],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="rounded-2xl bg-[#f7f8fa] p-4 text-[14px] leading-snug"
                >
                  <div className="font-grotesk text-[16px] font-bold">{t}</div>
                  <div className="mt-1 opacity-70">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- 5 KOTAK ---------- */}
      <section
        id="kotak"
        className="scroll-mt-20 px-6 py-14 md:px-[8.65vw] md:py-20"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. Moodboard */}
          <Reveal delay={0}>
            <Card>
              <CardTag>01 — referensi</CardTag>
              <CardTitle>Moodboard</CardTitle>
              <p className="mt-2 text-[15px] leading-relaxed opacity-70">
                Kumpulan tone warna, font, dan referensi visual di Canva. Acuan
                wajib sebelum mulai desain.
              </p>
              <OpenButton href={LINKS.moodboard} label="Buka Canva Moodboard" />
            </Card>
          </Reveal>

          {/* 2. Anggota + PIC */}
          <Reveal delay={80}>
            <Card>
              <CardTag>02 — tim</CardTag>
              <CardTitle>Foto Anggota + PIC</CardTitle>
              <p className="mt-2 text-[15px] leading-relaxed opacity-70">
                Kenalan sama tim Medbrand dan penanggung jawab tiap bagian.
                Foto anggota menyusul.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MEMBERS.map((m) => (
                  <li
                    key={m.name}
                    className="rounded-2xl border border-black/10 bg-white/60 p-3"
                  >
                    <div className="font-grotesk flex h-9 w-9 items-center justify-center rounded-full bg-[#080909] text-sm font-bold text-white">
                      {m.initials}
                    </div>
                    <div className="mt-2 text-[14px] font-medium leading-tight">
                      {m.name}
                    </div>
                    <div className="text-[13px] opacity-60">{m.role}</div>
                    {m.pic && (
                      <div className="mt-1 inline-block rounded-full bg-black/5 px-2 py-0.5 text-[12px]">
                        {m.pic}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs opacity-50">
                Ganti nama/foto di <code>lib/site.ts → MEMBERS</code>
              </p>
            </Card>
          </Reveal>

          {/* 3. COPM */}
          <Reveal delay={160}>
            <Card>
              <CardTag>03 — data</CardTag>
              <CardTitle>COPM</CardTitle>
              <p className="mt-2 text-[15px] leading-relaxed opacity-70">
                Catatan operasional &amp; progres kerja Medbrand — live dari
                spreadsheet.
              </p>
            <OpenButton href={LINKS.copm} label="Buka Spreadsheet COPM" />
            </Card>
          </Reveal>

          {/* 4. Todo */}
          <Reveal delay={0}>
            <TodoBox />
          </Reveal>

          {/* 5. Hasil Design */}
          <Reveal delay={80} className="md:col-span-2 lg:col-span-2">
            <Card className="md:col-span-2 lg:col-span-2">
              <CardTag>05 — output</CardTag>
              <CardTitle>Hasil Design</CardTitle>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed opacity-70">
                Galeri final — feed, story, poster, dan semua asset yang sudah
                disetujui. Tersimpan di Canva bersama.
              </p>
              <OpenButton
                href={LINKS.hasilDesign}
                label="Buka Canva Hasil Design"
              />
              <p className="mt-3 text-xs opacity-50">
                Link Canva menyusul — set di <code>lib/site.ts → LINKS.hasilDesign</code>
              </p>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
