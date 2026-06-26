"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightOutlined } from "@ant-design/icons";
import { towers } from "@/lib/data";
import styles from "./TowerGrid.module.css";

export default function TowerGrid() {
  return (
    <div className={styles.grid}>
      {towers.map((t, i) => (
        <motion.div
          key={t.slug}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href={`/${t.slug}`} className={styles.card}>
            <div
              className={styles.img}
              style={{ backgroundImage: `url(${t.heroImage})` }}
            />
            <div className={styles.shade} />
            <div className={styles.body}>
              <span className={styles.floors}>{t.floors}</span>
              <h3 className={`display ${styles.name}`}>{t.nameMn}</h3>
              <p className={styles.tag}>{t.tagline}</p>
              <span className={styles.more}>
                Дэлгэрэнгүй <ArrowRightOutlined />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
