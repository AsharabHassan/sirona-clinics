import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://demo.sironaaesthetics.agency"),
  title: "PBSerum VELURIA for Clinics | Sirona Aesthetics",
  description:
    "Preview a clinic-branded AI patient journey and book a free 20-minute VELURIA clinic consultation with Sirona Aesthetics.",
  applicationName: "Sirona VELURIA for Clinics",
  openGraph: {
    type: "website",
    title: "VELURIA AI Clinic Growth | Sirona Aesthetics",
    description: "From patient interest to booked consultation with a clinic-branded VELURIA AI funnel.",
    images: [{ url: "/og.png", width: 1732, height: 909, alt: "VELURIA AI clinic growth funnel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELURIA AI Clinic Growth | Sirona Aesthetics",
    description: "From patient interest to booked consultation with a clinic-branded VELURIA AI funnel.",
    images: ["/og.png"],
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Sirona VELURIA" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#F4FBF9",
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
