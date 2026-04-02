import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adaptive Downloader Control Center",
  description:
    "Production-ready adaptive YouTube downloader: direct delivery first, browser merge second, quota-controlled fallback last.",
  openGraph: {
    title: "Adaptive Downloader Control Center",
    description:
      "Analyze a YouTube URL, inspect formats, and route downloads through direct, client-merge, or guarded fallback paths.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
