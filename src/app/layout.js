import localFont from 'next/font/local'
import "./globals.css";
import AOSProvider from "@/components/AOSProvider";
import CustomSessionProvider from "@/components/CustomSessionProvider";
import { TransactionProvider } from "@/contexts/TransactionContext";

const hentEunoyalk = localFont({
  src: '../../public/fonts/HentEunoyalk/Hent Eunoyalk.ttf',
  variable: '--font-hentEunoyalk',
})
const helvetica = localFont({
  src: [
    {
      path: '../../public/fonts/helvetica/Helvetica.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/helvetica/Helvetica-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/helvetica/Helvetica-Oblique.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/helvetica/Helvetica-BoldOblique.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/helvetica/helvetica-light-587ebe5a59211.ttf',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica',
})

export const metadata = {
  metadataBase: new URL("https://intougm2026.com"),
  title: {
    default: "InTO UGM 2026",
    template: "%s | InTO UGM 2026",
  },
  description: "InTO UGM 2026 - Terangi Jalanmu Menuju Bulaksumur. Rangkaian kegiatan Try Out, University Fair, dan Talkshow Inspiratif untuk talenta muda Sumatera Selatan.",
  keywords: ["InTO UGM", "UGM 2026", "Try Out UGM", "IKAGAMASS", "Palembang", "Sumatera Selatan", "Universitas Gadjah Mada"],
  authors: [{ name: "IKAGAMASS UGM" }],
  creator: "IKAGAMASS UGM",
  publisher: "IKAGAMASS UGM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "InTO UGM 2026",
    description: "Terangi Jalanmu Menuju Bulaksumur. Rangkaian kegiatan Try Out, University Fair, dan Talkshow Inspiratif.",
    url: "https://intougm2026.com",
    siteName: "InTO UGM 2026",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InTO UGM 2026",
    description: "Terangi Jalanmu Menuju Bulaksumur. Rangkaian kegiatan Try Out, University Fair, dan Talkshow Inspiratif.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${helvetica.variable} ${hentEunoyalk.variable} font-helvetica antialiased bg-[#FAE6FF]`}
      >
        <CustomSessionProvider>
          <AOSProvider>
            <TransactionProvider>
              {children}
            </TransactionProvider>
          </AOSProvider>
        </CustomSessionProvider>

      </body>
    </html>
  );
}
