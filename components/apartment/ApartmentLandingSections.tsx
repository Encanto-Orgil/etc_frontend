"use client";

import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuBellRing,
  LuCar,
  LuHouse,
  LuShieldCheck,
  LuSparkles,
  LuSunrise,
} from "react-icons/lu";
import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import SalesContacts from "@/components/SalesContacts";
import { submitInquiry } from "@/lib/api";
import {
  apartmentCta,
  apartmentEcosystem,
  apartmentGallery,
  apartmentInteriors,
  type ApartmentHighlightIcon,
} from "@/lib/apartmentContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./apartment.landing.module.css";
import formStyles from "./ApartmentContactForm.module.css";

const { TextArea } = Input;

const highlightIconMap: Record<ApartmentHighlightIcon, IconType> = {
  views: LuSunrise,
  interiors: LuSparkles,
  smart: LuHouse,
  security: LuShieldCheck,
  services: LuBellRing,
  parking: LuCar,
};

export function ApartmentConceptSection() {
  const copy = useTranslations().residence.concept;

  return (
    <section className={styles.sectionMinimal} id="concept">
      <div className={styles.inner} data-apartment-reveal>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.lead}>{copy.body}</p>
      </div>
    </section>
  );
}

export function ApartmentHighlightsSection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionCream} id="highlights">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.highlightsSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.highlightsSection.title}</h2>
        <div className={styles.highlightGrid}>
          {copy.highlights.map((card) => {
            const Icon = highlightIconMap[card.icon];

            return (
              <article key={card.title} className={styles.highlightCard} data-apartment-reveal>
                <span className={styles.iconWrap} aria-hidden>
                  <Icon className={styles.icon} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ApartmentTypesSection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionCream} id="types">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.typesSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.typesSection.title}</h2>
        <p className={styles.lead}>{copy.typesSection.note}</p>
        <div className={styles.typeGrid}>
          {copy.layoutTypes.map((type) => (
            <article key={type.title} className={styles.typeCard} data-apartment-reveal>
              <h3>{type.title}</h3>
              <span className={styles.typeSize}>{copy.typesSection.orientationLabel}</span>
              <ul className={styles.orientationList}>
                {type.orientations.map((orientation) => (
                  <li key={orientation}>{orientation}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApartmentInteriorSection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionDark} id="interiors">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.interiorsSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.interiorsSection.title}</h2>
        <div className={styles.interiorTrack}>
          {apartmentInteriors.map((item, index) => {
            const text = copy.interiors[index];
            return (
              <figure key={item.title} className={styles.interiorCard} data-apartment-reveal>
                <Image src={item.image} alt={text?.title ?? item.title} width={640} height={480} />
                <div>
                  <h3>{text?.title ?? item.title}</h3>
                  <span>{text?.note ?? item.note}</span>
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ApartmentSpecificationsSection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionDark} id="specifications">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.specificationsSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.specificationsSection.title}</h2>
        <p className={styles.lead}>{copy.specificationsSection.lead}</p>
        <div className={styles.specGrid}>
          {copy.specifications.map((item, index) => (
            <article
              key={item.label}
              className={`${styles.specCard} ${index >= 2 && index <= 4 ? styles.specFeatured : ""}`}
              data-apartment-reveal
            >
              <h3>{item.label}</h3>
              <p>{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApartmentServicesSection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionCream} id="services">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.servicesSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.servicesSection.title}</h2>
        <div className={styles.split}>
          <div className={styles.serviceCol} data-apartment-reveal>
            <h3>{copy.servicesSection.hotelLabel}</h3>
            <ul>
              {copy.services.hotel.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.serviceCol} data-apartment-reveal>
            <h3>{copy.servicesSection.lifestyleLabel}</h3>
            <ul>
              {copy.services.lifestyle.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ApartmentLocationSection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionDark} id="location">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.locationSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.locationSection.title}</h2>
        <div className={styles.nearbyGrid}>
          {copy.nearby.map((place) => (
            <div key={place.name} className={styles.nearbyItem} data-apartment-reveal>
              <strong>{place.name}</strong>
              <span>{place.time}</span>
            </div>
          ))}
        </div>
        <div className={styles.travelRow}>
          {copy.travel.map((t) => (
            <span key={t.label} className={styles.travelChip}>
              {t.time} · {t.label}
            </span>
          ))}
        </div>
        <div className={styles.mapWrap} data-apartment-reveal>
          <iframe
            title="Encanto Trade Center - Residence location"
            loading="lazy"
            src="https://www.google.com/maps?q=Encanto+Town+Ulaanbaatar&output=embed"
          />
        </div>
      </div>
    </section>
  );
}

export function ApartmentInvestmentSection() {
  const copy = useTranslations().residence.investment;

  return (
    <section className={styles.sectionDark} id="investment">
      <div className={styles.inner} data-apartment-reveal>
        <p className={styles.eyebrow}>Investment Value</p>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.lead}>{copy.body}</p>
        <div className={styles.investGrid}>
          {copy.points.map((point) => (
            <div key={point} className={styles.investPoint}>
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApartmentGallerySection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionCream} id="gallery">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.gallerySection.eyebrow}</p>
        <h2 className={styles.title}>{copy.gallerySection.title}</h2>
        <div className={styles.galleryGrid}>
          {apartmentGallery.map((item, index) => (
            <figure
              key={item.title}
              className={`${styles.galleryItem} ${item.wide ? styles.galleryWide : ""} ${item.tall ? styles.galleryTall : ""}`}
              data-apartment-reveal
            >
              <Image src={item.image} alt={copy.gallery[index]?.title ?? item.title} width={800} height={600} />
              <span>{copy.gallery[index]?.title ?? item.title}</span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApartmentWhySection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionMinimal} id="why">
      <div className={styles.inner} data-apartment-reveal>
        <p className={styles.eyebrow}>{copy.whySection.eyebrow}</p>
        <h2 className={styles.title}>{copy.whySection.title}</h2>
        <ul className={styles.whyList}>
          {copy.why.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ApartmentEcosystemSection() {
  const copy = useTranslations().residence;

  return (
    <section className={styles.sectionDark} id="ecosystem">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.ecosystemSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.ecosystemSection.title}</h2>
        <div className={styles.ecosystemGrid}>
          {copy.ecosystem.map((item, index) => (
            <Link
              key={item.label}
              href={apartmentEcosystem[index]?.href ?? "/"}
              className={styles.ecoCard}
              data-apartment-reveal
            >
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApartmentCtaSection() {
  const copy = useTranslations().residence.cta;

  return (
    <section className={styles.ctaSection} id="cta">
      <div
        className={styles.ctaBg}
        style={{ backgroundImage: "url(/images/renders/render-35.jpg)" }}
        data-apartment-parallax
      />
      <div className={styles.ctaOverlay} />
      <div className={`${styles.inner} ${styles.ctaInner}`}>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.lead}>{copy.body}</p>
        <div className={styles.ctaActions}>
          <Link href={apartmentCta.primary.href} className={styles.ctaPrimary}>
            {copy.primary}
          </Link>
          <Link href={apartmentCta.secondary.href} className={styles.ctaSecondary}>
            {copy.secondary}
          </Link>
          <Link href={apartmentCta.tertiary.href} className={styles.ctaGhost}>
            {copy.tertiary}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ApartmentContactForm() {
  const copy = useTranslations().residence.contact;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onFinish = async (values: {
    name: string;
    phone: string;
    email?: string;
    interest?: string;
    message?: string;
  }) => {
    setLoading(true);
    try {
      await submitInquiry({
        name: values.name,
        phone: values.phone,
        email: values.email,
        interest: "apartment",
        message: [values.interest ? `Interest: ${values.interest}` : null, values.message]
          .filter(Boolean)
          .join("\n"),
      });
      setDone(true);
      form.resetFields();
      message.success(copy.formSuccess);
    } catch {
      message.error(copy.formError);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={formStyles.done}>
        <h3>{copy.formSuccess}</h3>
        <Button onClick={() => setDone(false)}>{copy.submit}</Button>
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" className={formStyles.form} onFinish={onFinish} requiredMark={false}>
      <div className={formStyles.row}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Your name" size="large" />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input placeholder="99xxxxxx" size="large" />
        </Form.Item>
      </div>
      <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
        <Input placeholder="name@example.com" size="large" />
      </Form.Item>
      <Form.Item name="message" label="Message">
        <TextArea rows={4} placeholder="Tell us about your requirements..." />
      </Form.Item>
      <Button type="primary" htmlType="submit" size="large" loading={loading} className={formStyles.submit}>
        {copy.submit}
      </Button>
    </Form>
  );
}

export function ApartmentContactSection() {
  const copy = useTranslations().residence.contact;

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Contact</p>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.lead}>{copy.body}</p>
        <div className={styles.contactPanel} data-apartment-reveal>
          <ApartmentContactForm />
        </div>
        <div data-apartment-reveal>
          <SalesContacts scope="apartment" variant="strip" onDark />
        </div>
      </div>
    </section>
  );
}

export function ApartmentPageFooter() {
  const copy = useTranslations().residence;

  return (
    <footer className={styles.pageFooter}>
      <div className={styles.inner}>
        <p>{copy.pageFooter}</p>
        <nav aria-label="Encanto Trade Center - Residence footer">
          <Link href="#contact">Contact</Link>
          <Link href="#location">Location</Link>
          <Link href="#contact">Leasing</Link>
          <Link href="/">Encanto Trade Center</Link>
        </nav>
      </div>
    </footer>
  );
}
