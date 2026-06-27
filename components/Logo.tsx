import Image from "next/image";
import Link from "next/link";
import { ENCHANTO_LOGO_ASPECT, ENCHANTO_LOGO_SRC } from "@/lib/branding";
import styles from "./Logo.module.css";

type Props = {
  className?: string;
  height?: number;
  priority?: boolean;
  onClick?: () => void;
  /** White logo on dark backgrounds (header). Use "muted" for light section watermarks. */
  variant?: "white" | "muted";
};

export default function Logo({
  className,
  height = 40,
  priority = false,
  onClick,
  variant = "white",
}: Props) {
  const width = Math.round(height * ENCHANTO_LOGO_ASPECT);

  return (
    <Link href="/" className={`${styles.logo} ${className || ""}`} onClick={onClick}>
      <Image
        src={ENCHANTO_LOGO_SRC}
        alt="Encanto Trade Center"
        width={width}
        height={height}
        className={`${styles.img} ${variant === "muted" ? styles.muted : styles.white}`}
        style={{ height }}
        priority={priority}
      />
    </Link>
  );
}
