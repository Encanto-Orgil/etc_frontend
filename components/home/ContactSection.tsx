import SalesContacts from "@/components/SalesContacts";
import HomeInquiryForm from "@/components/home/HomeInquiryForm";
import shared from "./home.shared.module.css";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  return (
    <section className={`${shared.section} ${shared.darkSection} ${styles.section}`} id="contact">
      <div className={shared.container}>
        <div className={styles.hero} data-home-reveal>
          <p className={shared.eyebrowLight}>Contact</p>
          <h2 className={styles.title}>Schedule Your Private Presentation</h2>
          <p className={shared.leadLight}>
            Meet our sales team and explore office, residence, retail, and investment opportunities.
          </p>
        </div>

        <div className={styles.grid} data-home-reveal>
          <SalesContacts scope="home" onDark className={styles.team} />
          <div className={styles.formWrap}>
            <HomeInquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
