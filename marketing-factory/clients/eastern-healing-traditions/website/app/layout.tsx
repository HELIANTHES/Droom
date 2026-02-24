import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackingScripts from "@/components/TrackingScripts";

const serif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eastern Healing Traditions | Acupuncture & TCM in Grayslake, IL",
    template: "%s | Eastern Healing Traditions",
  },
  description:
    "Dr. Vel Natarajan, DACM — the highest-credentialed TCM practitioner in Lake County. Acupuncture, herbal medicine, and 5 more modalities for chronic pain, autoimmune conditions, and lasting wellness.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://easternhealingtraditions.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Eastern Healing Traditions",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
        <TrackingScripts />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
