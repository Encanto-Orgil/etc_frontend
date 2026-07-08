"use client";

import Link from "next/link";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import InquiryForm from "@/components/InquiryForm";
import {
  getSalesContacts,
  salesInitials,
} from "@/lib/salesTeam";
import {
  getOfficeSalesProfile,
  OFFICE_SALES_DEPARTMENT,
} from "@/lib/officeSalesDisplay";
import { useLocale, useTranslations } from "@/lib/i18n";
import styles from "./OfficeContactSection.module.css";

export default function OfficeContactSection() {
  const { locale } = useLocale();
  const copy = useTranslations().office.contact;
  const contacts = getSalesContacts("home");
  const featured = contacts.find((person) => person.scopes.includes("office")) ?? contacts[0];
  const others = contacts.filter((person) => person.id !== featured.id);
  const featuredProfile = getOfficeSalesProfile(featured.id, featured.name);

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <header className={styles.header} data-office-reveal>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.lead}>{copy.lead}</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.aside} data-office-reveal>
            <div className={styles.deptCard}>
              <p className={styles.deptLabel}>{OFFICE_SALES_DEPARTMENT.name}</p>
              <address className={styles.deptAddress}>
                {OFFICE_SALES_DEPARTMENT.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <p className={styles.deptHours}>{OFFICE_SALES_DEPARTMENT.hours}</p>
            </div>

            <article className={styles.featuredCard}>
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={featuredProfile.displayName}
                  className={styles.featuredPhoto}
                  loading="eager"
                />
              ) : (
                <div className={styles.featuredAvatar}>{salesInitials(featuredProfile.displayName)}</div>
              )}
              <div className={styles.featuredBody}>
                <div className={styles.featuredTop}>
                  <div>
                    <p className={styles.featuredName}>{featuredProfile.displayName}</p>
                    <p className={styles.featuredRole}>{featuredProfile.title}</p>
                  </div>
                  <span className={styles.featuredBadge}>{copy.primaryContact}</span>
                </div>
                <p className={styles.featuredFocus}>{featuredProfile.focus}</p>
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

            {others.length > 0 ? (
              <div className={styles.otherTeam}>
                <p className={styles.otherLabel}>{copy.alsoAvailable}</p>
                <div className={styles.otherList}>
                  {others.map((person) => {
                    const profile = getOfficeSalesProfile(person.id, person.name);
                    return (
                    <article key={person.id} className={styles.otherCard}>
                      {person.image ? (
                        <img
                          src={person.image}
                          alt={profile.displayName}
                          className={styles.otherPhoto}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.otherAvatar}>{salesInitials(profile.displayName)}</div>
                      )}
                      <div className={styles.otherBody}>
                        <p className={styles.otherName}>{profile.displayName}</p>
                        <p className={styles.otherRole}>{profile.title}</p>
                        <p className={styles.otherFocus}>{profile.focus}</p>
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
                    );
                  })}
                </div>
              </div>
            ) : null}
          </aside>

          <div className={styles.formColumn} data-office-reveal>
            <div className={styles.formPanel}>
              <div className={styles.formIntro}>
                <h3>{copy.formTitle}</h3>
                <p>{copy.formLead}</p>
              </div>
              <InquiryForm defaultInterest="office" locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
