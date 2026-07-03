"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { submitInquiry } from "@/lib/api";
import {
  mallAtrium,
  mallBrandCategories,
  mallContact,
  mallDining,
  mallEntertainment,
  mallEvents,
  mallExperience,
  mallGallery,
  mallHighlights,
  mallInterestOptions,
  mallLeasing,
  mallStats,
  mallVisit,
  mallZones,
} from "@/lib/mallContent";
import styles from "./mall.landing.module.css";
import formStyles from "./MallContactForm.module.css";

const { TextArea } = Input;

export function MallExperienceSection() {
  return (
    <section className={styles.sectionCream} id="experience">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={styles.splitImage} data-mall-reveal>
            <Image src={mallExperience.image} alt="Encanto Mall interior" width={900} height={700} />
          </div>
          <div data-mall-reveal>
            <p className={styles.eyebrow}>The Experience</p>
            <h2 className={styles.title}>{mallExperience.title}</h2>
            <p className={styles.lead}>{mallExperience.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MallHighlightsSection() {
  return (
    <section className={styles.sectionCream} id="highlights">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Key Highlights</p>
        <h2 className={styles.title}>Urban Lifestyle, Elevated</h2>
        <div className={styles.highlightGrid}>
          {mallHighlights.map((card) => (
            <article key={card.title} className={styles.highlightCard} data-mall-reveal>
              <span aria-hidden>{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MallZonesSection() {
  return (
    <section className={styles.sectionDark} id="zones">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Mall Zones</p>
        <h2 className={styles.title}>Explore Every District</h2>
        <div className={styles.zoneTrack}>
          {mallZones.map((zone) => (
            <figure key={zone.title} className={styles.zoneCard} data-mall-reveal>
              <Image src={zone.image} alt={zone.title} width={600} height={450} />
              <div>
                <h3>{zone.title}</h3>
                <p>{zone.description}</p>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MallBrandsSection() {
  return (
    <section className={styles.sectionCream} id="brands">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Brand Mix</p>
        <h2 className={styles.title}>Global & Local Curated Tenants</h2>
        <p className={styles.lead}>Placeholder brand mix — actual tenant list updated as leasing progresses.</p>
        <div className={styles.brandGrid}>
          {mallBrandCategories.map((cat) => (
            <article key={cat.title} className={styles.brandCategory} data-mall-reveal>
              <h3>{cat.title}</h3>
              <div className={styles.brandChips}>
                {cat.brands.map((brand) => (
                  <span key={brand} className={styles.brandChip}>
                    {brand}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MallAtriumSection() {
  return (
    <section className={styles.sectionCream} id="atrium">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Atrium & Architecture</p>
        <h2 className={styles.title}>{mallAtrium.title}</h2>
        <p className={styles.lead}>{mallAtrium.body}</p>
        <figure className={styles.fullImage} data-mall-reveal>
          <Image src={mallAtrium.image} alt={mallAtrium.title} width={1400} height={700} />
        </figure>
      </div>
    </section>
  );
}

export function MallDiningSection() {
  return (
    <section className={styles.sectionCream} id="dining">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={styles.diningGrid} data-mall-reveal>
            {mallDining.images.map((src) => (
              <Image key={src} src={src} alt="Dining at Encanto Mall" width={400} height={300} />
            ))}
          </div>
          <div data-mall-reveal>
            <p className={styles.eyebrow}>Dining Experience</p>
            <h2 className={styles.title}>{mallDining.title}</h2>
            <p className={styles.lead}>{mallDining.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MallEntertainmentSection() {
  return (
    <section className={styles.sectionDark} id="entertainment">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Entertainment</p>
        <h2 className={styles.title}>Where the City Comes Alive</h2>
        <div className={styles.entertainGrid}>
          {mallEntertainment.map((item) => (
            <article key={item.title} className={styles.entertainCard} data-mall-reveal>
              <span aria-hidden>{item.icon}</span>
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MallWhySection() {
  return (
    <section className={styles.sectionDark} id="why-mall">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Why Encanto Mall</p>
        <h2 className={styles.title}>Built for Modern Urban Life</h2>
        <div className={styles.statsGrid}>
          {mallStats.map((stat) => (
            <div key={stat.label} className={styles.statItem} data-mall-reveal>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MallGallerySection() {
  return (
    <section className={styles.sectionCream} id="gallery">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Gallery</p>
        <h2 className={styles.title}>Experience the Energy</h2>
        <div className={styles.galleryGrid}>
          {mallGallery.map((item) => (
            <figure
              key={item.title}
              className={`${styles.galleryItem} ${item.wide ? styles.galleryWide : ""} ${item.tall ? styles.galleryTall : ""}`}
              data-mall-reveal
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

export function MallLeasingSection() {
  return (
    <section className={styles.leasingSection} id="leasing">
      <div className={styles.leasingGlass} aria-hidden />
      <div className={`${styles.inner} ${styles.leasingInner}`}>
        <p className={styles.eyebrow}>For Brands</p>
        <h2 className={styles.title}>{mallLeasing.title}</h2>
        <p className={styles.lead}>{mallLeasing.body}</p>
        <div className={styles.leasingActions}>
          <Link href={mallLeasing.primary.href} className={styles.leasingPrimary}>
            {mallLeasing.primary.label}
          </Link>
          <Link href={mallLeasing.secondary.href} className={styles.leasingSecondary}>
            {mallLeasing.secondary.label}
          </Link>
          <Link href={mallLeasing.tertiary.href} className={styles.leasingGhost}>
            {mallLeasing.tertiary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function MallVisitSection() {
  return (
    <section className={styles.sectionCream} id="visit">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Visitor Information</p>
        <h2 className={styles.title}>{mallVisit.title}</h2>
        <div className={styles.visitGrid}>
          <div className={styles.visitCard} data-mall-reveal>
            <strong>Opening Hours</strong>
            <p>{mallVisit.hours}</p>
          </div>
          <div className={styles.visitCard} data-mall-reveal>
            <strong>Parking</strong>
            <p>{mallVisit.parking}</p>
          </div>
          <div className={styles.visitCard} data-mall-reveal>
            <strong>Location</strong>
            <p>{mallVisit.map}</p>
          </div>
          {mallEvents.map((event) => (
            <div key={event.title} className={styles.visitCard} data-mall-reveal>
              <strong>{event.date}</strong>
              <p>
                {event.title} · {event.zone}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.visitActions}>
          <a
            href="https://www.google.com/maps?q=Encanto+Town+Ulaanbaatar"
            target="_blank"
            rel="noreferrer"
            className={styles.visitBtn}
          >
            Get Directions
          </a>
          <Link href="#gallery" className={styles.visitBtnGhost}>
            See Events
          </Link>
        </div>
      </div>
    </section>
  );
}

function MallContactForm() {
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
      const interestLabel =
        mallInterestOptions.find((o) => o.value === values.interest)?.label ?? values.interest;
      const details = [
        interestLabel ? `Interest: ${interestLabel}` : null,
        values.message?.trim() ?? null,
      ]
        .filter(Boolean)
        .join("\n");

      await submitInquiry({
        name: values.name,
        phone: values.phone,
        email: values.email,
        interest: "mall",
        message: details,
      });
      setDone(true);
      form.resetFields();
      message.success("Your message has been received.");
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
        <p>Our team will contact you shortly.</p>
        <Button onClick={() => setDone(false)}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" className={formStyles.form} onFinish={onFinish} requiredMark={false}>
      <div className={formStyles.row}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Required" }]}>
          <Input placeholder="Your name" size="large" />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Required" }]}>
          <Input placeholder="99xxxxxx" size="large" />
        </Form.Item>
      </div>
      <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Invalid email" }]}>
        <Input placeholder="name@example.com" size="large" />
      </Form.Item>
      <Form.Item name="interest" label="Interest">
        <Select size="large" placeholder="Select interest" options={mallInterestOptions} />
      </Form.Item>
      <Form.Item name="message" label="Message">
        <TextArea rows={4} placeholder="Tell us about your inquiry..." />
      </Form.Item>
      <Button type="primary" htmlType="submit" size="large" loading={loading} className={formStyles.submit}>
        Send Message
      </Button>
    </Form>
  );
}

export function MallContactSection() {
  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Contact</p>
        <h2 className={styles.title}>{mallContact.title}</h2>
        <p className={styles.lead}>{mallContact.body}</p>
        <div className={styles.contactPanel} data-mall-reveal>
          <MallContactForm />
        </div>
        <div className={styles.footerCta}>
          <p>{mallContact.footer}</p>
          <span className={styles.footerSub}>{mallContact.footerSub}</span>
        </div>
      </div>
    </section>
  );
}
