import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "AyoBell - Sistem Bell Sekolah Otomatis",
  description: "Sistem manajemen bell sekolah otomatis. Atur jadwal bell, bell darurat, dan upload suara bell custom untuk sekolah Anda.",
  keywords: ["bell sekolah", "bell otomatis", "jadwal sekolah", "AyoBell"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${dmSans.variable} ${dmSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
