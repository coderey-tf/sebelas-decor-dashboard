import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulasi Chatbot AI — Cek Pricelist & Katalog Dekorasi",
  description:
    "Simulasi interaktif chatbot AI Sebelas Decor. Dapatkan info pricelist resmi dekorasi pernikahan & lamaran, cek ketersediaan tanggal acara, dan konsultasi gratis.",
  openGraph: {
    title: "Simulasi Chatbot AI Sebelas Decor — Cek Pricelist & Katalog Dekorasi",
    description:
      "Simulasi interaktif chatbot AI Sebelas Decor. Dapatkan info pricelist resmi dekorasi pernikahan & lamaran secara otomatis.",
  },
};

export default function SimulasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
