import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SiteShell from "@/components/SiteShell";
import SiteSchema from "@/components/SiteSchema";
import { rootMetadata } from "@/lib/seo";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body>
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
