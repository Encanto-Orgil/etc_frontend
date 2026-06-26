import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Encanto Trade Center — Монголын хамгийн өндөр шилэн фасадтай металл бүтээц",
  description:
    "Encanto Trade Center нь Баянзүрх дүүрэгт баригдаж буй 35 давхар, 135 метр өндөр төсөл.",
  openGraph: {
    title: "Encanto Trade Center",
    images: ["/images/renders/render-8.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body>
        <AntdRegistry>
          <ThemeProvider>
            <SiteShell>{children}</SiteShell>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
