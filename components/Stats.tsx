"use client";

import { motion } from "framer-motion";
import type { Stat } from "@/lib/data";
import styles from "./Stats.module.css";

export default function Stats({ items }: { items: Stat[] }) {
  return (
    <div className={styles.grid}>
      {items.map((s, i) => (
        <motion.div
          key={s.label}
          className={styles.item}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.value}>
            {s.value}
            {s.unit ? <span className={styles.unit}>{s.unit}</span> : null}
          </div>
          <div className={styles.label}>{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
