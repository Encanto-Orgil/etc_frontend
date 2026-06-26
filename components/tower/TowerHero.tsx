"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./TowerHero.module.css";

export default function TowerHero({
  image,
  video,
  eyebrow,
  title,
  subtitle,
  primaryHref = "#contact",
  primaryLabel = "Холбоо барих",
  secondaryHref,
  secondaryLabel,
  showEyebrow = true,
  showActions = true,
  showContent = true,
}: {
  image: string;
  video?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  showEyebrow?: boolean;
  showActions?: boolean;
  showContent?: boolean;
}) {
  return (
    <section className={styles.hero}>
      {video ? (
        <video
          className={styles.bgVideo}
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
      ) : (
        <div className={styles.bg} style={{ backgroundImage: `url(${image})` }} />
      )}
      <div className={styles.overlay} />
      {showContent ? (
        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {showEyebrow && eyebrow ? (
              <span className={styles.eyebrow}>{eyebrow}</span>
            ) : null}
            {title ? (
              <h1 className={`${styles.title} ${!showEyebrow ? styles.titleWide : ""}`}>{title}</h1>
            ) : null}
            {subtitle ? <p className={styles.sub}>{subtitle}</p> : null}
            {showActions ? (
              <div className={styles.actions}>
                <Link href={primaryHref} className="btn-primary">
                  {primaryLabel}
                </Link>
                {secondaryHref && secondaryLabel ? (
                  <Link href={secondaryHref} className="btn-outline">
                    {secondaryLabel}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
