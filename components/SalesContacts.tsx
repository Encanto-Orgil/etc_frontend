"use client";

import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  getSalesContacts,
  isPrimaryContact,
  salesInitials,
  type SalesScope,
} from "@/lib/salesTeam";
import styles from "./SalesContacts.module.css";

type Props = {
  scope: SalesScope;
  variant?: "cards" | "strip";
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

  if (variant === "strip") {
    const primary = contacts[0];
    if (!primary) return null;

    return (
      <div className={`${styles.strip} ${className ?? ""}`}>
        <span className={styles.stripLabel}>Шууд зөвлөгөө:</span>
        <strong>{primary.name}</strong>
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
      <p className={styles.heading}>Борлуулалтын алба</p>
      <div className={styles.list}>
        {contacts.map((person) => {
          const primary = isPrimaryContact(person, scope);

          return (
            <article
              key={person.id}
              className={`${styles.card} ${primary ? styles.cardPrimary : ""}`}
            >
              <div className={styles.avatar}>{salesInitials(person.name)}</div>
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <p className={styles.name}>{person.name}</p>
                  {primary ? <span className={styles.badge}>Таны хариуцагч</span> : null}
                </div>
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
