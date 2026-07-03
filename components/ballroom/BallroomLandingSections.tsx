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
import { ballroomEventTypes as brochureEventTypes } from "@/lib/ballroomBrochure";
import {
  ballroomContact,
  ballroomExperience,
  ballroomFaq,
  ballroomHighlights,
  ballroomHighlightsSection,
  ballroomSignature,
  type BallroomHighlightIcon,
} from "@/lib/ballroomContent";
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
  return (
    <section className={styles.sectionCream} id="experience">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={styles.splitImage} data-ballroom-reveal>
            <Image
              src={ballroomExperience.image}
              alt="Encanto Grande Ballroom panoramic view"
              width={900}
              height={700}
            />
          </div>
          <div data-ballroom-reveal>
            <p className={styles.eyebrow}>The Grand Experience</p>
            <h2 className={styles.title}>{ballroomExperience.title}</h2>
            <p className={styles.lead}>{ballroomExperience.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BallroomHighlightsSection() {
  return (
    <section className={styles.sectionDark} id="highlights">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{ballroomHighlightsSection.eyebrow}</p>
        <h2 className={styles.title}>{ballroomHighlightsSection.title}</h2>
        <p className={styles.lead}>{ballroomHighlightsSection.lead}</p>
        <div className={styles.highlightGrid}>
          {ballroomHighlights.map((card) => {
            const Icon = highlightIconMap[card.icon];

            return (
              <article key={card.title} className={styles.highlightCard} data-ballroom-reveal>
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
          <p className={styles.eyebrow}>Signature Moments</p>
          <h2 className={styles.title}>{ballroomSignature.title}</h2>
          <p className={styles.lead}>{ballroomSignature.body}</p>
        </div>
      </div>
    </section>
  );
}

export function BallroomFaqSection() {
  return (
    <section className={styles.sectionDark} id="faq">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>FAQ</p>
        <h2 className={styles.title}>Planning Questions</h2>
        <div className={styles.faqList}>
          {ballroomFaq.map((item) => (
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
      const details = [
        values.eventType ? `Event Type: ${values.eventType}` : null,
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
      message.success("Your request has been received. We will contact you shortly.");
    } catch {
      message.error("Unable to submit. Please try again or call our sales team.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={formStyles.done}>
        <h3>Thank You</h3>
        <p>Our event specialists will contact you shortly.</p>
        <Button onClick={() => setDone(false)}>Submit Another Request</Button>
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
      <div className={formStyles.row}>
        <Form.Item name="eventType" label="Event Type">
          <Select
            size="large"
            placeholder="Select event type"
            options={brochureEventTypes.map((e) => ({ value: e.label, label: e.label }))}
          />
        </Form.Item>
        <Form.Item name="eventDate" label="Event Date">
          <DatePicker size="large" className={formStyles.datePicker} popupClassName={formStyles.datePopup} />
        </Form.Item>
      </div>
      <Form.Item name="guestCount" label="Estimated Guests">
        <InputNumber min={1} max={2000} size="large" className={formStyles.guests} placeholder="500" />
      </Form.Item>
      <Form.Item name="message" label="Message">
        <TextArea rows={4} placeholder="Tell us about your event vision..." />
      </Form.Item>
      <div className={formStyles.actions}>
        <Button type="primary" htmlType="submit" size="large" loading={loading} className={formStyles.submit}>
          Request a Proposal
        </Button>
        <button type="button" className={formStyles.secondary} onClick={onCheckAvailability}>
          Check Availability
        </button>
      </div>
    </Form>
  );
}

type ContactTab = "availability" | "proposal";

export function BallroomContactSection() {
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
          <p className={styles.contactEyebrow}>Contact & Reservation</p>
          <h2 className={styles.contactTitle}>{ballroomContact.title}</h2>
          <p className={styles.contactLead}>{ballroomContact.body}</p>
        </header>

        <div className={styles.contactCard} data-ballroom-reveal>
          <div className={styles.contactTabs} role="tablist" aria-label="Contact options">
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
              Check Availability
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
              Request a Proposal
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
                <p className={styles.contactColHint}>
                  Select a date to view open time slots and submit a booking request.
                </p>
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
                <p className={styles.contactColHint}>
                  Share your event details and our specialists will prepare a tailored proposal.
                </p>
                <BallroomReservationForm onCheckAvailability={() => selectTab("availability")} />
              </div>
            )}
          </div>
        </div>

        <div className={styles.salesContact} data-ballroom-reveal>
          <SalesContacts scope="ballroom" variant="featured" />
        </div>

        <p className={styles.footerCta} data-ballroom-reveal>
          {ballroomContact.footer}
        </p>
      </div>
    </section>
  );
}
