import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SiteShell from "@/components/SiteShell";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CdnResourceHints from "@/components/CdnResourceHints";
import SiteSchema from "@/components/SiteSchema";
import { fontDisplay } from "@/lib/fonts";
import { rootMetadata, rootViewport } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = rootMetadata;
export const viewport = rootViewport;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${inter.variable}`}>
      <head>
        <CdnResourceHints />
      </head>
      <body>
        <GoogleAnalytics />
        <SiteSchema />
        <AntdRegistry>
          <ThemeProvider>
            <SiteShell>{children}</SiteShell>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
