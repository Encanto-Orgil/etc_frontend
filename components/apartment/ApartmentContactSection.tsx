"use client";

import Link from "next/link";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import InquiryForm from "@/components/InquiryForm";
import {
  getSalesContacts,
  SALES_DEPARTMENT,
  salesInitials,
} from "@/lib/salesTeam";
import {
  getOfficeSalesProfile,
  OFFICE_SALES_DEPARTMENT,
} from "@/lib/officeSalesDisplay";
import { useLocale, useTranslations } from "@/lib/i18n";
import styles from "../office/OfficeContactSection.module.css";

const APARTMENT_PRIMARY_IDS = ["nomin-erdene", "rolomjav"] as const;

export default function ApartmentContactSection() {
  const { locale } = useLocale();
  const copy = useTranslations().residence.contact;
  const contacts = getSalesContacts("apartment");
  const primaryContacts = APARTMENT_PRIMARY_IDS.map((id) => contacts.find((person) => person.id === id))
    .filter((person): person is NonNullable<typeof person> => Boolean(person));
  const department = locale === "mn" ? SALES_DEPARTMENT : OFFICE_SALES_DEPARTMENT;

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <header className={styles.header} data-apartment-reveal>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.lead}>{copy.lead}</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.aside} data-apartment-reveal>
            <div className={styles.deptCard}>
              <p className={styles.deptLabel}>{department.name}</p>
              <address className={styles.deptAddress}>
                {department.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <p className={styles.deptHours}>{department.hours}</p>
            </div>

            {primaryContacts.map((person) => {
              const profile = getOfficeSalesProfile(person.id, person.name);
              const displayName = locale === "mn" ? person.name : profile.displayName;
              const title = locale === "mn" ? person.title : profile.title;
              const focus = locale === "mn" ? person.focus : profile.focus;

              return (
                <article key={person.id} className={styles.featuredCard}>
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={displayName}
                      className={styles.featuredPhoto}
                      loading="eager"
                    />
                  ) : (
                    <div className={styles.featuredAvatar}>{salesInitials(displayName)}</div>
                  )}
                  <div className={styles.featuredBody}>
                    <div className={styles.featuredTop}>
                      <div>
                        <p className={styles.featuredName}>{displayName}</p>
                        <p className={styles.featuredRole}>{title}</p>
                      </div>
                      <span className={styles.featuredBadge}>{copy.primaryContact}</span>
                    </div>
                    <p className={styles.featuredFocus}>{focus}</p>
                    <div className={styles.featuredActions}>
                      {person.phones.map((phone) => (
                        <Link
                          key={phone}
                          href={`tel:+976${phone.replace(/-/g, "")}`}
                          className={styles.actionPrimary}
                        >
                          <PhoneOutlined />
                          {phone}
                        </Link>
                      ))}
                      <Link href={`mailto:${person.email}`} className={styles.actionSecondary}>
                        <MailOutlined />
                        {person.email}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </aside>

          <div className={styles.formColumn} data-apartment-reveal>
            <div className={styles.formPanel}>
              <div className={styles.formIntro}>
                <h3>{copy.formTitle}</h3>
                <p>{copy.formLead}</p>
              </div>
              <InquiryForm defaultInterest="apartment" locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
