"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Feature } from "@/lib/data";
import styles from "./FeatureBlock.module.css";

export default function FeatureBlock({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  const reversed = index % 2 === 1;

  return (
    <div ref={ref} className={`${styles.block} ${reversed ? styles.rev : ""}`}>
      <div className={styles.media}>
        <motion.div
          className={styles.img}
          style={{
            scale: imgScale,
            y: imgY,
            backgroundImage: `url(${feature.image})`,
          }}
        />
      </div>

      <div className={styles.text}>
        <motion.span
          className={styles.num}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          0{index + 1}
        </motion.span>
        <motion.h3
          className={`display ${styles.title}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {feature.title}
        </motion.h3>
        <motion.p
          className={styles.desc}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {feature.description}
        </motion.p>
      </div>
    </div>
  );
}
