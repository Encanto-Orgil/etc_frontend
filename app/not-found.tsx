import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found at Encanto Trade Center.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundView />;
}
