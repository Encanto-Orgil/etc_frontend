import { Cormorant_Garamond } from "next/font/google";

/**
 * Display serif — web fallback for Canela / PP Editorial New.
 * Drop licensed `.woff2` files into `public/fonts/` and extend @font-face when available.
 */
export const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
