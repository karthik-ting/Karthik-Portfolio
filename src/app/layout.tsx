import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Rethink_Sans } from "next/font/google";
import { asset } from "@/lib/utils";
import "@/styles/main.scss";

const sans = Rethink_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Update this once the site is deployed (e.g. your Vercel URL).
const SITE_URL = "https://karthik-manche.vercel.app";
const isVercel = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "vercel";

const TITLE = "Karthik Manche | Software Developer & Data Analyst";
const DESCRIPTION =
  "Portfolio of Karthik Manche, a Navi Mumbai based software developer building full-stack web apps with Next.js, Python automation and Power BI data dashboards.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Karthik Manche", "Software Developer", "Data Analyst", "Next.js", "Python", "Power BI", "SQL", "Mumbai"],
  authors: [{ name: "Karthik Manche", url: SITE_URL }],
  creator: "Karthik Manche",
  icons: { icon: { url: asset("/favicon.svg"), type: "image/svg+xml" } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Karthik Manche Portfolio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {children}
        {isVercel && <Analytics />}
      </body>
    </html>
  );
}
