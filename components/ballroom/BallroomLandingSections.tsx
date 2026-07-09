"use client";

import Image from "next/image";
import type { IconType } from "react-icons";
import {
  LuAudioLines,
  LuBaby,
  LuBuilding2,
  LuCircleParking,
  LuCigarette,
  LuCrown,
  LuGem,
  LuMic,
  LuShirt,
  LuSun,
  LuUsers,
  LuUtensilsCrossed,
} from "react-icons/lu";
import { Button, DatePicker, Form, Input, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import SalesContacts from "@/components/SalesContacts";
import { submitInquiry } from "@/lib/api";
import { ballroomExperience, ballroomSignature } from "@/lib/ballroomContent";
import {
  getBallroomHighlights,
  useLocale,
  useTranslations,
} from "@/lib/i18n";
import { useBallroomEventTypeOptions } from "@/lib/useBallroomEventTypeOptions";
import type { BallroomHighlightIcon } from "@/lib/i18n/types";
import BallroomAvailability from "./BallroomAvailability";
import styles from "./ballroom.landing.module.css";
import formStyles from "./BallroomReservationForm.module.css";

const { TextArea } = Input;

const highlightIconMap: Record<BallroomHighlightIcon, IconType> = {
  ballroom: LuBuilding2,
  capacity: LuUsers,
  stage: LuMic,
  catering: LuUtensilsCrossed,
  av: LuAudioLines,
  vip: LuCrown,
  bridal: LuGem,
  wardrobe: LuShirt,
  smoking: LuCigarette,
  motherBaby: LuBaby,
  terrace: LuSun,
  parking: LuCircleParking,
};

export function BallroomExperienceSection() {
  const copy = useTranslations().ballroom.experience;

  return (
    <section className={styles.sectionCream} id="experience">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={styles.splitImage} data-ballroom-reveal>
            <Image
              src={ballroomExperience.image}
              alt={copy.imageAlt}
              width={900}
              height={700}
            />
          </div>
          <div data-ballroom-reveal>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 className={styles.title}>{copy.title}</h2>
            <p className={styles.lead}>{copy.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BallroomHighlightsSection() {
  const { locale } = useLocale();
  const section = useTranslations().ballroom.highlightsSection;
  const highlights = getBallroomHighlights(locale);

  return (
    <section className={styles.sectionDark} id="highlights">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{section.eyebrow}</p>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.lead}>{section.lead}</p>
        <div className={styles.highlightGrid}>
          {highlights.map((card) => {
            const Icon = highlightIconMap[card.icon];

            return (
              <article key={card.icon} className={styles.highlightCard} data-ballroom-reveal>
                <span className={styles.highlightIconWrap} aria-hidden>
                  <Icon className={styles.highlightIcon} />
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

export function BallroomSignatureSection() {
  const copy = useTranslations().ballroom.signature;

  return (
    <section className={styles.signature} id="signature">
      <div
        className={styles.signatureBg}
        style={{ backgroundImage: `url(${ballroomSignature.image})` }}
        data-ballroom-parallax
      />
      <div className={styles.signatureOverlay} />
      <div className={`${styles.inner} ${styles.signatureInner}`}>
        <div data-ballroom-reveal>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.lead}>{copy.body}</p>
        </div>
      </div>
    </section>
  );
}

export function BallroomFaqSection() {
  const copy = useTranslations().ballroom.faq;

  return (
    <section className={styles.sectionDark} id="faq">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>
        <div className={styles.faqList}>
          {copy.items.map((item) => (
            <details key={item.q} className={styles.faqItem} data-ballroom-reveal>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BallroomReservationForm({ onCheckAvailability }: { onCheckAvailability?: () => void }) {
  const { locale } = useLocale();
  const copy = useTranslations().ballroom.reservationForm;
  const { options: eventTypeOptions, loading: eventTypesLoading } = useBallroomEventTypeOptions(locale);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onFinish = async (values: {
    name: string;
    phone: string;
    email?: string;
    eventType?: string;
    eventDate?: { format: (f: string) => string };
    guestCount?: number;
    message?: string;
  }) => {
    setLoading(true);
    try {
      const eventDate = values.eventDate?.format?.("YYYY-MM-DD") ?? "Not specified";
      const eventTypeLabel = eventTypeOptions.find((option) => option.value === values.eventType)?.label;
      const details = [
        eventTypeLabel ? `Event Type: ${eventTypeLabel}` : null,
        `Event Date: ${eventDate}`,
        values.guestCount ? `Estimated Guests: ${values.guestCount}` : null,
        values.message?.trim() ? values.message.trim() : null,
      ]
        .filter(Boolean)
        .join("\n");

      await submitInquiry({
        name: values.name,
        phone: values.phone,
        email: values.email,
        interest: "ballroom",
        message: details,
      });
      setDone(true);
      form.resetFields();
      message.success(copy.successMessage);
    } catch {
      message.error(copy.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={formStyles.done}>
        <h3>{copy.thankYouTitle}</h3>
        <p>{copy.thankYouBody}</p>
        <Button onClick={() => setDone(false)}>{copy.submitAnother}</Button>
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" className={formStyles.form} onFinish={onFinish} requiredMark={false}>
      <div className={formStyles.row}>
        <Form.Item name="name" label={copy.name} rules={[{ required: true, message: copy.required }]}>
          <Input placeholder={copy.namePlaceholder} size="large" />
        </Form.Item>
        <Form.Item name="phone" label={copy.phone} rules={[{ required: true, message: copy.required }]}>
          <Input placeholder={copy.phonePlaceholder} size="large" />
        </Form.Item>
      </div>
      <Form.Item name="email" label={copy.email} rules={[{ type: "email", message: copy.invalidEmail }]}>
        <Input placeholder={copy.emailPlaceholder} size="large" />
      </Form.Item>
      <div className={formStyles.row}>
        <Form.Item name="eventType" label={copy.eventType}>
          <Select
            size="large"
            placeholder={copy.eventTypePlaceholder}
            loading={eventTypesLoading}
            options={eventTypeOptions}
          />
        </Form.Item>
        <Form.Item name="eventDate" label={copy.eventDate}>
          <DatePicker size="large" className={formStyles.datePicker} popupClassName={formStyles.datePopup} />
        </Form.Item>
      </div>
      <Form.Item name="guestCount" label={copy.guestCount}>
        <InputNumber min={1} max={2000} size="large" className={formStyles.guests} placeholder={copy.guestCountPlaceholder} />
      </Form.Item>
      <Form.Item name="message" label={copy.message}>
        <TextArea rows={4} placeholder={copy.messagePlaceholder} />
      </Form.Item>
      <div className={formStyles.actions}>
        <Button type="primary" htmlType="submit" size="large" loading={loading} className={formStyles.submit}>
          {copy.submit}
        </Button>
        <button type="button" className={formStyles.secondary} onClick={onCheckAvailability}>
          {copy.checkAvailability}
        </button>
      </div>
    </Form>
  );
}

type ContactTab = "availability" | "proposal";

export function BallroomContactSection() {
  const copy = useTranslations().ballroom.contact;
  const [activeTab, setActiveTab] = useState<ContactTab>("availability");

  useEffect(() => {
    const syncTabFromHash = () => {
      if (window.location.hash === "#availability") {
        setActiveTab("availability");
      }
    };

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  const selectTab = (tab: ContactTab) => {
    setActiveTab(tab);
    const nextHash = tab === "availability" ? "#availability" : "#contact";
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  };

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.inner}>
        <header className={styles.contactHeader} data-ballroom-reveal>
          <p className={styles.contactEyebrow}>{copy.eyebrow}</p>
          <h2 className={styles.contactTitle}>{copy.title}</h2>
          <p className={styles.contactLead}>{copy.body}</p>
        </header>

        <div className={styles.contactCard} data-ballroom-reveal>
          <div className={styles.contactTabs} role="tablist" aria-label={copy.tabAriaLabel}>
            <button
              type="button"
              role="tab"
              id="tab-availability"
              aria-selected={activeTab === "availability"}
              aria-controls="panel-availability"
              className={styles.contactTab}
              data-active={activeTab === "availability" ? "true" : "false"}
              onClick={() => selectTab("availability")}
            >
              {copy.tabAvailability}
            </button>
            <button
              type="button"
              role="tab"
              id="tab-proposal"
              aria-selected={activeTab === "proposal"}
              aria-controls="panel-proposal"
              className={styles.contactTab}
              data-active={activeTab === "proposal" ? "true" : "false"}
              onClick={() => selectTab("proposal")}
            >
              {copy.tabProposal}
            </button>
          </div>

          <div className={styles.contactTabPanels}>
            {activeTab === "availability" ? (
              <div
                role="tabpanel"
                id="availability"
                aria-labelledby="tab-availability"
                className={styles.contactTabPanel}
              >
                <p className={styles.contactColHint}>{copy.availabilityHint}</p>
                <div className={styles.availabilityWrap}>
                  <BallroomAvailability variant="light" />
                </div>
              </div>
            ) : (
              <div
                role="tabpanel"
                id="panel-proposal"
                aria-labelledby="tab-proposal"
                className={styles.contactTabPanel}
              >
                <p className={styles.contactColHint}>{copy.proposalHint}</p>
                <BallroomReservationForm onCheckAvailability={() => selectTab("availability")} />
              </div>
            )}
          </div>
        </div>

        <div className={styles.salesContact} data-ballroom-reveal>
          <SalesContacts scope="ballroom" variant="featured" />
        </div>

        <p className={styles.footerCta} data-ballroom-reveal>
          {copy.footer}
        </p>
      </div>
    </section>
  );
}
