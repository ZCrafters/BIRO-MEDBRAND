export const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260908_073327_03643c0a-db33-417a-ae8f-4a39259c7f9c.mp4";

export const LINKS = {
  moodboard: "https://canva.link/p2fl1n11v9v5wci",
  copm: "https://docs.google.com/spreadsheets/d/11Bd-mpu-eop0b2VD3iD9OWaQtpyv3dBe/edit?usp=drivesdk&ouid=114793982423476275353&rtpof=true&sd=true",
  hasilDesign: "#", // link Canva belum tersedia
};

export type Member = {
  name: string;
  role: string;
  pic?: string;
  initials: string;
};

export const MEMBERS: Member[] = [
  { name: "Bernessa", role: "Sekben", initials: "B" },
  { name: "Nurul", role: "Education and Learning", initials: "N" },
  { name: "Faris", role: "Human Capital", initials: "F" },
  { name: "Keishya", role: "InT", initials: "K" },
  { name: "Kayla", role: "Public Relation", initials: "K" },
  { name: "Aulia", role: "Bnd", initials: "A" },
  { name: "Davina", role: "Comdev", initials: "D" },
];

export type TodoItem = {
  id: string;
  label: string;
  done: boolean;
};

export const DEFAULT_TODOS: TodoItem[] = [
  { id: "brief", label: "Kumpulkan brief & materi dari setiap divisi", done: false },
  { id: "moodboard", label: "Finalisasi moodboard & tone visual", done: false },
  { id: "feed", label: "Desain template feed Instagram", done: false },
  { id: "story", label: "Desain template story & highlight cover", done: false },
  { id: "dokumentasi", label: "Dokumentasi proker & after movie", done: false },
  { id: "arsip", label: "Arsipkan hasil design ke Canva bersama", done: false },
];
