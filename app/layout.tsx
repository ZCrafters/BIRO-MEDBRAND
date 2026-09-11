import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "Biro Medbrand — Paguyuban Karya Salemba Empat IPB",
  description:
    "Biro Media & Branding Paguyuban Karya Salemba Empat IPB — fresh ideas, imagination, and creative collaboration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={spaceGrotesk.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
