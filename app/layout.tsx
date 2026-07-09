import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SiteShell from "@/components/SiteShell";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import SiteSchema from "@/components/SiteSchema";
import { fontDisplay } from "@/lib/fonts";
import { rootMetadata } from "@/lib/seo";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontDisplay.variable}>
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
