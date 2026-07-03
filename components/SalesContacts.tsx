"use client";

import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  getSalesContacts,
  isPrimaryContact,
  SALES_DEPARTMENT,
  salesInitials,
  type SalesScope,
} from "@/lib/salesTeam";
import { getOfficeSalesProfile } from "@/lib/officeSalesDisplay";
import styles from "./SalesContacts.module.css";

type Props = {
  scope: SalesScope;
  variant?: "cards" | "strip" | "featured";
  className?: string;
  onDark?: boolean;
};

export default function SalesContacts({
  scope,
  variant = "cards",
  className,
  onDark = false,
}: Props) {
  const contacts = getSalesContacts(scope);

  if (variant === "featured") {
    const primary = contacts[0];
    if (!primary) return null;

    const profile = getOfficeSalesProfile(primary.id, primary.name);

    return (
      <article className={`${styles.featuredCard} ${onDark ? styles.featuredCardDark : ""} ${className ?? ""}`}>
        <p className={styles.featuredLabel}>Direct consultation</p>
        <div className={styles.featuredInner}>
          {primary.image ? (
            <img
              src={primary.image}
              alt={profile.displayName}
              className={styles.featuredPhoto}
              loading="lazy"
            />
          ) : (
            <div className={styles.featuredAvatar}>{salesInitials(profile.displayName)}</div>
          )}
          <div className={styles.featuredInfo}>
            <p className={styles.featuredName}>{profile.displayName}</p>
            <p className={styles.featuredRole}>{profile.title}</p>
            <div className={styles.featuredLinks}>
              {primary.phones.map((phone) => (
                <a key={phone} href={`tel:+976${phone.replace(/-/g, "")}`}>
                  <PhoneOutlined />
                  {phone}
                </a>
              ))}
              <a href={`mailto:${primary.email}`}>
                <MailOutlined />
                {primary.email}
              </a>
            </div>
          </div>
        </div>
        {primary.phones[0] ? (
          <a
            href={`tel:+976${primary.phones[0].replace(/-/g, "")}`}
            className={styles.featuredCta}
          >
            Schedule a Consultation
          </a>
        ) : null}
      </article>
    );
  }

  if (variant === "strip") {
    const primary = contacts[0];
    if (!primary) return null;

    return (
      <div className={`${styles.strip} ${onDark ? styles.stripDark : ""} ${className ?? ""}`}>
        <span className={styles.stripLabel}>Direct consultation</span>
        <strong>{primary.name}</strong>
        <span className={styles.stripMeta}>{primary.title}</span>
        {primary.phones.map((phone) => (
          <a key={phone} href={`tel:+976${phone.replace(/-/g, "")}`}>
            {phone}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`${styles.wrap} ${onDark ? styles.wrapDark : ""} ${className ?? ""}`}>
      <div className={styles.department}>
        <p className={styles.heading}>{SALES_DEPARTMENT.name}</p>
        <address className={styles.address}>
          {SALES_DEPARTMENT.addressLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </address>
        <p className={styles.hours}>{SALES_DEPARTMENT.hours}</p>
      </div>

      <div className={styles.list}>
        {contacts.map((person) => {
          const primary = isPrimaryContact(person, scope);

          return (
            <article
              key={person.id}
              className={`${styles.card} ${primary ? styles.cardPrimary : ""}`}
            >
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className={styles.avatarPhoto}
                  loading="lazy"
                />
              ) : (
                <div className={styles.avatar}>{salesInitials(person.name)}</div>
              )}
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <p className={styles.name}>{person.name}</p>
                  {primary ? <span className={styles.badge}>Таны хариуцагч</span> : null}
                </div>
                <p className={styles.role}>{person.title}</p>
                <p className={styles.focus}>{person.focus}</p>
                <div className={styles.links}>
                  {person.phones.map((phone) => (
                    <a key={phone} href={`tel:+976${phone.replace(/-/g, "")}`}>
                      <PhoneOutlined /> {phone}
                    </a>
                  ))}
                  <a href={`mailto:${person.email}`}>
                    <MailOutlined /> {person.email}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
