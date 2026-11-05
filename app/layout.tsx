import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { LightboxProvider } from "@/components/providers/LightboxProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { studio } from "@/data/site";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

const title = `${studio.name} — Wedding & Event Photographer, Bengaluru`;

export const metadata: Metadata = {
  metadataBase: new URL(studio.url),
  title: { default: title, template: `%s — ${studio.name}` },
  description: studio.description,
  applicationName: studio.name,
  keywords: [
    "wedding photographer Bengaluru",
    "event photographer Bengaluru",
    "destination wedding photography",
    "engagement photographer",
    "corporate event photography",
    "party photographer",
    "baby shower photographer",
  ],
  authors: [{ name: studio.shortName }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: studio.name,
    title,
    description: studio.description,
  },
  twitter: { card: "summary_large_image", title, description: studio.description },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable} is-loading`} suppressHydrationWarning>
      <body>
        <noscript>
          <style>{`html.is-loading{overflow:auto}.preloader{display:none}`}</style>
        </noscript>
        <a
          href="#main"
          className="label sr-only z-[130] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Preloader />
        <TransitionProvider>
          <LightboxProvider>
            <Header />
            <div id="page">
              <main id="main">{children}</main>
              <Footer />
            </div>
          </LightboxProvider>
        </TransitionProvider>
        <SmoothScroll />
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
