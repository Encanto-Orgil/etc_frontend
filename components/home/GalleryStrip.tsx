"use client";

import { motion } from "framer-motion";
import type { GalleryItem } from "@/lib/data";
import styles from "./GalleryStrip.module.css";

export default function GalleryStrip({
  items,
  id,
}: {
  items: GalleryItem[];
  id?: string;
}) {
  return (
    <section className={styles.section} id={id}>
      <div className={styles.track}>
        {items.map((item, i) => (
          <motion.figure
            key={item.image + i}
            className={`${styles.cell} ${i === 0 ? styles.wide : ""}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}
          >
            <img src={item.image} alt={item.caption || "Encanto Trade Center"} />
            {item.caption ? (
              <figcaption className={styles.cap}>{item.caption}</figcaption>
            ) : null}
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
