import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sebelasdecor.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sebelas Decor — Jasa Dekorasi Pernikahan & Lamaran Professional",
    template: "%s | Sebelas Decor",
  },
  description:
    "Sebelas Decor menyediakan jasa dekorasi pernikahan (wedding), lamaran (engagement), dan event impian di Gedung & Rumah dengan konsep modern, pricelist transparan, dan layanan professional.",
  keywords: [
    "sebelas decor",
    "dekorasi pernikahan",
    "dekorasi lamaran",
    "dekorasi wedding gedung",
    "dekorasi wedding rumah",
    "dekorasi engagement",
    "pricelist dekorasi",
    "katalog dekorasi pernikahan",
    "dekorasi jakarta",
    "dekorasi bekasi",
    "dekorasi bogor",
    "dekorasi tangerang",
    "dekorasi depok",
  ],
  authors: [{ name: "Sebelas Decor" }],
  creator: "Sebelas Decor",
  publisher: "Sebelas Decor",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Sebelas Decor — Jasa Dekorasi Pernikahan & Lamaran Professional",
    description:
      "Jasa dekorasi wedding & engagement terpercaya untuk gedung dan rumah. Cek pricelist resmi dan katalog dekorasi impian Anda.",
    url: siteUrl,
    siteName: "Sebelas Decor",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebelas Decor — Jasa Dekorasi Pernikahan & Lamaran Professional",
    description:
      "Jasa dekorasi wedding & engagement terpercaya untuk gedung dan rumah. Cek pricelist resmi dan katalog dekorasi impian Anda.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Sebelas Decor",
    image: `${siteUrl}/favicon.ico`,
    description:
      "Penyedia jasa dekorasi pernikahan (wedding) dan lamaran (engagement) profesional untuk lokasi Gedung, Hotel, dan Rumah.",
    url: siteUrl,
    telephone: "+6281234567890",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
      addressRegion: "Jawa Barat / DKI Jakarta",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-6.2088",
      longitude: "106.8456",
    },
    priceRange: "$$",
    areaServed: [
      "Jakarta",
      "Bogor",
      "Depok",
      "Tangerang",
      "Bekasi",
      "Bandung",
    ],
    sameAs: [],
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
