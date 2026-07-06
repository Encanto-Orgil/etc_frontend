"use client";

import { Collapse } from "antd";
import styles from "./HomeFaq.module.css";

const items = [
  {
    key: "1",
    label: "Encanto Trade Center хэдэн давхар бүтэц вэ?",
    children:
      "Төсөл нь 35 давхар, 135 метр өндөр. Оффис 24 давхар, орон сууц 34 давхар, Mall 6 давхар, Ballroom 7–8 давхарт байрлана. Суурь хэсэг 8 давхар.",
  },
  {
    key: "2",
    label: "Төсөл хаана байрлах вэ?",
    children:
      "Улаанбаатар хот, Баянзүрх дүүрэгт баригдаж буй төсөл бөгөөд хотын гол үйлчилгээ, тээврийн сүлжээнд ойрхон байршилтай.",
  },
  {
    key: "3",
    label: "Ямар хэсгүүдтэй вэ?",
    children:
      "Office Tower, Central Mall, Grand Ballroom, Encanto Trade Center - Residence — ажил, худалдаа, ёслол, амьдралын бүх хэрэгцээг нэг дор шийднэ.",
  },
  {
    key: "4",
    label: "Хэрхэн холбогдох вэ?",
    children:
      "Вэбийн холбоо барих хэсэгт хүсэлт илгээнэ үү. Бид таны сонирхсон хэсгийн талаар дэлгэрэнгүй мэдээлэл өгнө.",
  },
];

export default function HomeFaq({ image = "/images/renders/render-3.jpg" }: { image?: string }) {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.bg} style={{ backgroundImage: `url(${image})` }} />
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <h2 className={styles.title}>Түгээмэл асуултууд</h2>
        <Collapse
          className={styles.collapse}
          bordered={false}
          expandIconPosition="end"
          items={items.map((item) => ({
            key: item.key,
            label: <span className={styles.question}>{item.label}</span>,
            children: <p className={styles.answer}>{item.children}</p>,
          }))}
        />
      </div>
    </section>
  );
}
