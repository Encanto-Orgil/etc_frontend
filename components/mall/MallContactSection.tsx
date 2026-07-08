"use client";

import Link from "next/link";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { getSalesContacts, salesInitials } from "@/lib/salesTeam";
import { useTranslations } from "@/lib/i18n";
import shared from "@/components/home/home.shared.module.css";
import styles from "@/components/home/ContactSection.module.css";
import MallInquiryForm from "./MallInquiryForm";

export default function MallContactSection() {
  const homeContact = useTranslations().home.contact;
  const mallContact = useTranslations().mall.contact;
  const contacts = getSalesContacts("mall");
  const [featured, ...others] = contacts;

  return (
    <section className={`${shared.section} ${styles.section}`} id="contact">
      <div className={styles.glow} aria-hidden />

      <div className={shared.container}>
        <header className={styles.header} data-mall-reveal>
          <p className={shared.eyebrow}>{homeContact.eyebrow}</p>
          <h2 className={styles.title}>{mallContact.title}</h2>
          <p className={styles.lead}>{mallContact.body}</p>
        </header>

        <div className={styles.layout} data-mall-reveal>
          <aside className={styles.aside}>
            <div className={styles.deptCard}>
              <p className={styles.deptLabel}>{homeContact.departmentName}</p>
              <address className={styles.deptAddress}>
                {homeContact.departmentAddress.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <p className={styles.deptHours}>{homeContact.departmentHours}</p>
            </div>

            {featured ? (
              <article className={styles.featuredCard}>
                <div className={styles.featuredMedia}>
                  {featured.image ? (
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className={styles.featuredPhoto}
                      loading="eager"
                    />
                  ) : (
                    <div className={styles.featuredAvatar}>{salesInitials(featured.name)}</div>
                  )}
                  <span className={styles.featuredBadge}>{homeContact.primaryContact}</span>
                </div>

                <div className={styles.featuredBody}>
                  <p className={styles.featuredName}>{featured.name}</p>
                  <p className={styles.featuredRole}>{featured.title}</p>
                  <p className={styles.featuredFocus}>{featured.focus}</p>

                  <div className={styles.featuredActions}>
                    {featured.phones.map((phone) => (
                      <Link
                        key={phone}
                        href={`tel:+976${phone.replace(/-/g, "")}`}
                        className={styles.actionPrimary}
                      >
                        <PhoneOutlined />
                        {phone}
                      </Link>
                    ))}
                    <Link href={`mailto:${featured.email}`} className={styles.actionSecondary}>
                      <MailOutlined />
                      {featured.email}
                    </Link>
                  </div>
                </div>
              </article>
            ) : null}

            {others.length > 0 ? (
              <div className={styles.otherTeam}>
                <p className={styles.otherLabel}>{homeContact.alsoAvailable}</p>
                <div className={styles.otherList}>
                  {others.map((person) => (
                    <article key={person.id} className={styles.otherCard}>
                      {person.image ? (
                        <img
                          src={person.image}
                          alt={person.name}
                          className={styles.otherPhoto}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.otherAvatar}>{salesInitials(person.name)}</div>
                      )}
                      <div className={styles.otherBody}>
                        <p className={styles.otherName}>{person.name}</p>
                        <p className={styles.otherRole}>{person.title}</p>
                        <div className={styles.otherLinks}>
                          {person.phones.map((phone) => (
                            <a key={phone} href={`tel:+976${phone.replace(/-/g, "")}`}>
                              {phone}
                            </a>
                          ))}
                          <a href={`mailto:${person.email}`}>{person.email}</a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <div className={styles.formColumn}>
            <div className={styles.formPanel}>
              <div className={styles.formIntro}>
                <p className={styles.formEyebrow}>{homeContact.salesTeam}</p>
                <h3 className={styles.formTitle}>{homeContact.formTitle}</h3>
                <p className={styles.formLead}>{homeContact.formLead}</p>
              </div>
              <MallInquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
