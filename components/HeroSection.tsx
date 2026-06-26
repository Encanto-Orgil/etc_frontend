"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./HeroSection.module.css";

type Props = {
  id?: string;
  image: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  size?: "full" | "large";
  align?: "left" | "center";
};

export default function HeroSection({
  id,
  image,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  contentClassName,
  size = "full",
  align = "left",
}: Props) {
  return (
    <section
      id={id}
      className={`${styles.section} ${size === "large" ? styles.large : ""} ${className || ""}`}
    >
      <div className={styles.bg} style={{ backgroundImage: `url(${image})` }} />
      <div className={styles.overlay} />

      <div
        className={`${styles.inner} ${align === "center" ? styles.innerCenter : ""} ${contentClassName || ""}`}
      >
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          {subtitle ? <p className={styles.sub}>{subtitle}</p> : null}
          {children ? <div className={styles.body}>{children}</div> : null}
        </motion.div>
      </div>
    </section>
  );
}
