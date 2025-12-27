import HomeClient from "./HomeClient";

export const metadata = {
  title: "InTO UGM 2026 | Terangi Jalanmu Menuju Bulaksumur",
  description: "Selamat datang di InTO UGM 2026! Persiapkan dirimu untuk menempuh pendidikan di Universitas Gadjah Mada dengan rangkaian kegiatan Try Out, University Fair, dan Talkshow Inspiratif.",
  openGraph: {
    title: "InTO UGM 2026 | Terangi Jalanmu Menuju Bulaksumur",
    description: "Persiapkan dirimu untuk menempuh pendidikan di Universitas Gadjah Mada dengan rangkaian kegiatan Try Out, University Fair, dan Talkshow Inspiratif.",
    url: "https://intougm2026.com",
    siteName: "InTO UGM 2026",
    images: [
      {
        url: "/images/bg-hero.png",
        width: 1200,
        height: 630,
        alt: "InTO UGM 2026 Hero",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InTO UGM 2026 | Terangi Jalanmu Menuju Bulaksumur",
    description: "Persiapkan dirimu untuk menempuh pendidikan di Universitas Gadjah Mada dengan rangkaian kegiatan Try Out, University Fair, dan Talkshow Inspiratif.",
    images: ["/images/bg-hero.png"],
  },
};

export default function Home() {
  return <HomeClient />;
}
