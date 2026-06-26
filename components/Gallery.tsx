"use client";

import { Image } from "antd";
import { motion } from "framer-motion";
import type { GalleryItem } from "@/lib/data";
import styles from "./Gallery.module.css";

export default function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <Image.PreviewGroup>
      <div className={styles.grid}>
        {items.map((g, i) => (
          <motion.figure
            key={g.image + i}
            className={`${styles.cell} ${i % 5 === 0 ? styles.wide : ""}`}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-6%" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={g.image}
              alt={g.caption || "Encanto Trade Center"}
              className={styles.img}
              rootClassName={styles.imgRoot}
            />
            {g.caption ? <figcaption className={styles.cap}>{g.caption}</figcaption> : null}
          </motion.figure>
        ))}
      </div>
    </Image.PreviewGroup>
  );
}
