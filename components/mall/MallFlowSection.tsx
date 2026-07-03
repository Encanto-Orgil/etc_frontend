import { mallFlowAudiences, mallFlowSteps } from "@/lib/mallContent";
import styles from "./MallFlowSection.module.css";

export default function MallFlowSection() {
  return (
    <section className={styles.section} id="flow">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Mall Flow</p>
        <h2 className={styles.title}>Foot Traffic Design</h2>
        <p className={styles.lead}>
          Designed to maximize natural foot traffic across the entire Encanto ecosystem.
        </p>

        <div className={styles.flowTrack} data-mall-reveal>
          {mallFlowSteps.map((step, i) => (
            <div key={step.label} className={styles.flowStep}>
              <span className={styles.flowDot} data-mall-flow-dot />
              <strong>{step.label}</strong>
              <span>{step.note}</span>
              {i < mallFlowSteps.length - 1 ? <span className={styles.flowArrow} aria-hidden>→</span> : null}
            </div>
          ))}
        </div>

        <div className={styles.audienceGrid}>
          {mallFlowAudiences.map((item) => (
            <article key={item.label} className={styles.audienceCard} data-mall-reveal>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
