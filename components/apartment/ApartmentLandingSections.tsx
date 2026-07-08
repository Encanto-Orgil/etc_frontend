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
  apartmentConcept,
  apartmentContact,
  apartmentCta,
  apartmentEcosystem,
  apartmentHighlights,
  apartmentInteriors,
  apartmentInvestment,
  apartmentNearby,
  apartmentServices,
  apartmentSpecifications,
  apartmentSpecificationsSection,
  apartmentTravel,
  apartmentLayoutTypes,
  apartmentTypesSection,
  apartmentWhy,
  apartmentGallery,
  type ApartmentHighlightIcon,
} from "@/lib/apartmentContent";
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
  return (
    <section className={styles.sectionMinimal} id="concept">
      <div className={styles.inner} data-apartment-reveal>
        <p className={styles.eyebrow}>Encanto Trade Center - Residence</p>
        <h2 className={styles.title}>{apartmentConcept.title}</h2>
        <p className={styles.lead}>{apartmentConcept.body}</p>
      </div>
    </section>
  );
}

export function ApartmentHighlightsSection() {
  return (
    <section className={styles.sectionCream} id="highlights">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Key Highlights</p>
        <h2 className={styles.title}>Elevated Living</h2>
        <div className={styles.highlightGrid}>
          {apartmentHighlights.map((card) => {
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
  return (
    <section className={styles.sectionCream} id="types">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{apartmentTypesSection.eyebrow}</p>
        <h2 className={styles.title}>{apartmentTypesSection.title}</h2>
        <p className={styles.lead}>{apartmentTypesSection.note}</p>
        <div className={styles.typeGrid}>
          {apartmentLayoutTypes.map((type) => (
            <article key={type.title} className={styles.typeCard} data-apartment-reveal>
              <h3>{type.title}</h3>
              <span className={styles.typeSize}>Харууц</span>
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
  return (
    <section className={styles.sectionDark} id="interiors">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Interior Experience</p>
        <h2 className={styles.title}>Designed for Modern Life</h2>
        <div className={styles.interiorTrack}>
          {apartmentInteriors.map((item) => (
            <figure key={item.title} className={styles.interiorCard} data-apartment-reveal>
              <Image src={item.image} alt={item.title} width={640} height={480} />
              <div>
                <h3>{item.title}</h3>
                <span>{item.note}</span>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApartmentSpecificationsSection() {
  return (
    <section className={styles.sectionDark} id="specifications">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{apartmentSpecificationsSection.eyebrow}</p>
        <h2 className={styles.title}>{apartmentSpecificationsSection.title}</h2>
        <p className={styles.lead}>{apartmentSpecificationsSection.lead}</p>
        <div className={styles.specGrid}>
          {apartmentSpecifications.map((item) => (
            <article
              key={item.label}
              className={`${styles.specCard} ${item.featured ? styles.specFeatured : ""}`}
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
  return (
    <section className={styles.sectionCream} id="services">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Services & Lifestyle</p>
        <h2 className={styles.title}>Hotel-Level Living</h2>
        <div className={styles.split}>
          <div className={styles.serviceCol} data-apartment-reveal>
            <h3>Hotel-Level Services</h3>
            <ul>
              {apartmentServices.hotel.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.serviceCol} data-apartment-reveal>
            <h3>Lifestyle Access</h3>
            <ul>
              {apartmentServices.lifestyle.map((item) => (
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
  return (
    <section className={styles.sectionDark} id="location">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Location</p>
        <h2 className={styles.title}>Live at the Center of Everything</h2>
        <div className={styles.nearbyGrid}>
          {apartmentNearby.map((place) => (
            <div key={place.name} className={styles.nearbyItem} data-apartment-reveal>
              <strong>{place.name}</strong>
              <span>{place.time}</span>
            </div>
          ))}
        </div>
        <div className={styles.travelRow}>
          {apartmentTravel.map((t) => (
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
  return (
    <section className={styles.sectionDark} id="investment">
      <div className={styles.inner} data-apartment-reveal>
        <p className={styles.eyebrow}>Investment Value</p>
        <h2 className={styles.title}>{apartmentInvestment.title}</h2>
        <p className={styles.lead}>{apartmentInvestment.body}</p>
        <div className={styles.investGrid}>
          {apartmentInvestment.points.map((point) => (
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
  return (
    <section className={styles.sectionCream} id="gallery">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Gallery</p>
        <h2 className={styles.title}>Life Above the Skyline</h2>
        <div className={styles.galleryGrid}>
          {apartmentGallery.map((item) => (
            <figure
              key={item.title}
              className={`${styles.galleryItem} ${item.wide ? styles.galleryWide : ""} ${item.tall ? styles.galleryTall : ""}`}
              data-apartment-reveal
            >
              <Image src={item.image} alt={item.title} width={800} height={600} />
              <span>{item.title}</span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApartmentWhySection() {
  return (
    <section className={styles.sectionMinimal} id="why">
      <div className={styles.inner} data-apartment-reveal>
        <p className={styles.eyebrow}>Why Encanto Trade Center - Residence</p>
        <h2 className={styles.title}>The Definitive Address</h2>
        <ul className={styles.whyList}>
          {apartmentWhy.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ApartmentEcosystemSection() {
  return (
    <section className={styles.sectionDark} id="ecosystem">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Integrated Ecosystem</p>
        <h2 className={styles.title}>Connected Urban Living</h2>
        <div className={styles.ecosystemGrid}>
          {apartmentEcosystem.map((item) => (
            <Link key={item.label} href={item.href} className={styles.ecoCard} data-apartment-reveal>
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
  return (
    <section className={styles.ctaSection} id="cta">
      <div
        className={styles.ctaBg}
        style={{ backgroundImage: "url(/images/renders/render-35.jpg)" }}
        data-apartment-parallax
      />
      <div className={styles.ctaOverlay} />
      <div className={`${styles.inner} ${styles.ctaInner}`}>
        <h2 className={styles.title}>{apartmentCta.title}</h2>
        <p className={styles.lead}>{apartmentCta.body}</p>
        <div className={styles.ctaActions}>
          <Link href={apartmentCta.primary.href} className={styles.ctaPrimary}>
            {apartmentCta.primary.label}
          </Link>
          <Link href={apartmentCta.secondary.href} className={styles.ctaSecondary}>
            {apartmentCta.secondary.label}
          </Link>
          <Link href={apartmentCta.tertiary.href} className={styles.ctaGhost}>
            {apartmentCta.tertiary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ApartmentContactForm() {
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
      message.success("Request received. We will contact you shortly.");
    } catch {
      message.error("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={formStyles.done}>
        <h3>Thank You</h3>
        <p>Our residence team will be in touch soon.</p>
        <Button onClick={() => setDone(false)}>Submit Another</Button>
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
      <Form.Item name="interest" label="Interest">
        <Select
          size="large"
          placeholder="Select interest"
          options={[
            { value: "retail", label: "Retail" },
            { value: "leasing", label: "Leasing" },
            { value: "event", label: "Event" },
            { value: "residence", label: "Residence Purchase" },
          ]}
        />
      </Form.Item>
      <Form.Item name="message" label="Message">
        <TextArea rows={4} placeholder="Tell us about your requirements..." />
      </Form.Item>
      <Button type="primary" htmlType="submit" size="large" loading={loading} className={formStyles.submit}>
        Send Request
      </Button>
    </Form>
  );
}

export function ApartmentContactSection() {
  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Contact</p>
        <h2 className={styles.title}>{apartmentContact.title}</h2>
        <p className={styles.lead}>{apartmentContact.body}</p>
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
  return (
    <footer className={styles.pageFooter}>
      <div className={styles.inner}>
        <p>{apartmentContact.footer}</p>
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
