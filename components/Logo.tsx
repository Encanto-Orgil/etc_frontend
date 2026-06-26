import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";

type Props = {
  className?: string;
  height?: number;
  priority?: boolean;
  onClick?: () => void;
};

export default function Logo({
  className,
  height = 40,
  priority = false,
  onClick,
}: Props) {
  const width = Math.round(height * 2.85);

  return (
    <Link href="/" className={`${styles.logo} ${className || ""}`} onClick={onClick}>
      <Image
        src="/images/cento-logo.webp"
        alt="Encanto Trade Center"
        width={width}
        height={height}
        className={styles.img}
        style={{ height }}
        priority={priority}
      />
    </Link>
  );
}
