"use client";

import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { submitInquiry, type InquiryPayload } from "@/lib/api";
import styles from "./InquiryForm.module.css";

const { TextArea } = Input;

const INTEREST_OPTIONS: Record<
  "mn" | "en",
  { value: InquiryPayload["interest"]; label: string }[]
> = {
  mn: [
    { value: "office", label: "Office Tower" },
    { value: "mall", label: "Central Mall" },
    { value: "ballroom", label: "Grand Ballroom" },
    { value: "apartment", label: "Encanto Trade Center - Residence" },
    { value: "general", label: "Ерөнхий мэдээлэл" },
  ],
  en: [
    { value: "office", label: "Office Tower" },
    { value: "mall", label: "Central Mall" },
    { value: "ballroom", label: "Grand Ballroom" },
    { value: "apartment", label: "Encanto Trade Center - Residence" },
    { value: "general", label: "General inquiry" },
  ],
};

const COPY = {
  mn: {
    successToast: "Таны хүсэлтийг хүлээн авлаа. Удахгүй холбогдоно.",
    errorToast: "Илгээхэд алдаа гарлаа. Backend сервер ажиллаж байгаа эсэхийг шалгана уу.",
    doneTitle: "Баярлалаа",
    doneBody: "Таны хүсэлтийг амжилттай хүлээн авлаа. Бид удахгүй тантай холбогдоно.",
    sendAgain: "Дахин илгээх",
    nameLabel: "Нэр",
    nameRequired: "Нэрээ оруулна уу",
    namePlaceholder: "Таны нэр",
    phoneLabel: "Утас",
    phoneRequired: "Утасны дугаараа оруулна уу",
    emailLabel: "И-мэйл",
    emailInvalid: "Зөв и-мэйл оруулна уу",
    interestLabel: "Interest",
    messageLabel: "Зурвас",
    messagePlaceholder: "Таны хүсэлт, асуулт...",
    submit: "Хүсэлт илгээх",
  },
  en: {
    successToast: "Your inquiry has been received. We will contact you shortly.",
    errorToast: "Something went wrong. Please check that the server is running and try again.",
    doneTitle: "Thank you",
    doneBody: "Your inquiry was submitted successfully. We will be in touch soon.",
    sendAgain: "Send another",
    nameLabel: "Name",
    nameRequired: "Please enter your name",
    namePlaceholder: "Your name",
    phoneLabel: "Phone",
    phoneRequired: "Please enter your phone number",
    emailLabel: "Email",
    emailInvalid: "Please enter a valid email",
    interestLabel: "Interest",
    messageLabel: "Message",
    messagePlaceholder: "Your request or question...",
    submit: "Send inquiry",
  },
} as const;

export default function InquiryForm({
  defaultInterest = "general",
  defaultMessage = "",
  hideInterest = false,
  interestOptions,
  locale = "en",
  theme = "light",
  onSuccess,
}: {
  defaultInterest?: InquiryPayload["interest"];
  defaultMessage?: string;
  hideInterest?: boolean;
  interestOptions?: { value: InquiryPayload["interest"]; label: string }[];
  locale?: "mn" | "en";
  theme?: "light" | "dark";
  onSuccess?: () => void;
}) {
  const copy = COPY[locale];
  const options = interestOptions ?? INTEREST_OPTIONS[locale];
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onFinish = async (values: InquiryPayload) => {
    setLoading(true);
    try {
      await submitInquiry(values);
      setDone(true);
      form.resetFields();
      message.success(copy.successToast);
      onSuccess?.();
    } catch {
      message.error(copy.errorToast);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={`${styles.done} ${theme === "dark" ? styles.doneDark : ""}`}>
        <h3 className="display">{copy.doneTitle}</h3>
        <p>{copy.doneBody}</p>
        <Button type="default" onClick={() => setDone(false)}>
          {copy.sendAgain}
        </Button>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      className={`${styles.form} ${theme === "dark" ? styles.formDark : ""}`}
      initialValues={{ interest: defaultInterest, message: defaultMessage }}
      onFinish={onFinish}
      requiredMark={false}
    >
      <div className={styles.row}>
        <Form.Item
          name="name"
          label={copy.nameLabel}
          rules={[{ required: true, message: copy.nameRequired }]}
        >
          <Input placeholder={copy.namePlaceholder} size="large" />
        </Form.Item>
        <Form.Item
          name="phone"
          label={copy.phoneLabel}
          rules={[{ required: true, message: copy.phoneRequired }]}
        >
          <Input placeholder="99xxxxxx" size="large" />
        </Form.Item>
      </div>

      <div className={styles.row}>
        <Form.Item
          name="email"
          label={copy.emailLabel}
          rules={[{ type: "email", message: copy.emailInvalid }]}
        >
          <Input placeholder="name@example.com" size="large" />
        </Form.Item>
        {hideInterest ? (
          <Form.Item name="interest" hidden>
            <Input />
          </Form.Item>
        ) : (
          <Form.Item name="interest" label={copy.interestLabel}>
            <Select
              size="large"
              options={options}
              popupClassName={theme === "dark" ? styles.selectDropdownDark : undefined}
            />
          </Form.Item>
        )}
      </div>

      <Form.Item name="message" label={copy.messageLabel}>
        <TextArea rows={4} placeholder={copy.messagePlaceholder} />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        loading={loading}
        className={styles.submit}
      >
        {copy.submit}
      </Button>
    </Form>
  );
}
