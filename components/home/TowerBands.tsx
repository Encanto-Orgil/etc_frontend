"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { towers } from "@/lib/data";
import styles from "./TowerBands.module.css";

export default function TowerBands() {
  return (
    <div className={styles.wrap} id="towers">
      {towers.map((t, i) => (
        <Link
          key={t.slug}
          href={`/${t.slug}`}
          className={`${styles.band} ${i % 2 === 1 ? styles.bandReverse : ""}`}
        >
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${t.heroImage})` }}
          />
          <div className={styles.scrim} />
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.floors}>{t.floors}</span>
            <h2 className={`serif ${styles.name}`}>{t.nameMn}</h2>
            <p className={styles.tag}>{t.tagline}</p>
            <p className={styles.summary}>{t.summary}</p>
            <span className={styles.more}>
              Дэлгэрэнгүй <span aria-hidden>→</span>
            </span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
