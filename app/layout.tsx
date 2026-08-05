import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PBSerum VELURIA for Clinics | Sirona Aesthetics",
  description:
    "Preview a clinic-branded AI patient journey and book a free 20-minute VELURIA clinic consultation with Sirona Aesthetics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable}`}>
      <body>
        <MetaPixel />
        {/* Subtle cool atmosphere — clinical, science-forward (Sirona) */}
        <div className="atmosphere">
          <div
            className="orb"
            style={{
              top: "-10%",
              right: "-5%",
              width: "50vmax",
              height: "50vmax",
              background:
                "radial-gradient(circle at 50% 50%, #DFF3EE, #CDEBE3 55%, transparent 72%)",
              opacity: 0.5,
              filter: "blur(70px)",
            }}
          />
          <div
            className="orb"
            style={{
              bottom: "-15%",
              left: "-8%",
              width: "45vmax",
              height: "45vmax",
              background:
                "radial-gradient(circle at 50% 50%, #F1F6F9, #E4EEF2 60%, transparent 72%)",
              opacity: 0.55,
              filter: "blur(60px)",
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
