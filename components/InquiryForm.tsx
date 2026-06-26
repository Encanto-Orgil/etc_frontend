"use client";

import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { submitInquiry, type InquiryPayload } from "@/lib/api";
import styles from "./InquiryForm.module.css";

const { TextArea } = Input;

export default function InquiryForm({
  defaultInterest = "general",
  defaultMessage = "",
  hideInterest = false,
  onSuccess,
}: {
  defaultInterest?: InquiryPayload["interest"];
  defaultMessage?: string;
  hideInterest?: boolean;
  onSuccess?: () => void;
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onFinish = async (values: InquiryPayload) => {
    setLoading(true);
    try {
      await submitInquiry(values);
      setDone(true);
      form.resetFields();
      message.success("Таны хүсэлтийг хүлээн авлаа. Удахгүй холбогдоно.");
      onSuccess?.();
    } catch {
      message.error(
        "Илгээхэд алдаа гарлаа. Backend сервер ажиллаж байгаа эсэхийг шалгана уу."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={styles.done}>
        <h3 className="display">Баярлалаа</h3>
        <p>Таны хүсэлтийг амжилттай хүлээн авлаа. Бид удахгүй тантай холбогдоно.</p>
        <Button type="default" onClick={() => setDone(false)}>
          Дахин илгээх
        </Button>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      className={styles.form}
      initialValues={{ interest: defaultInterest, message: defaultMessage }}
      onFinish={onFinish}
      requiredMark={false}
    >
      <div className={styles.row}>
        <Form.Item
          name="name"
          label="Нэр"
          rules={[{ required: true, message: "Нэрээ оруулна уу" }]}
        >
          <Input placeholder="Таны нэр" size="large" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Утас"
          rules={[{ required: true, message: "Утасны дугаараа оруулна уу" }]}
        >
          <Input placeholder="99xxxxxx" size="large" />
        </Form.Item>
      </div>

      <div className={styles.row}>
        <Form.Item name="email" label="И-мэйл" rules={[{ type: "email", message: "Зөв и-мэйл оруулна уу" }]}>
          <Input placeholder="name@example.com" size="large" />
        </Form.Item>
        {hideInterest ? (
          <Form.Item name="interest" hidden>
            <Input />
          </Form.Item>
        ) : (
          <Form.Item name="interest" label="Сонирхол">
            <Select
              size="large"
              options={[
                { value: "office", label: "Office Tower" },
                { value: "mall", label: "Central Mall" },
                { value: "ballroom", label: "Grand Ballroom" },
                { value: "apartment", label: "Sky Residence" },
                { value: "general", label: "Ерөнхий мэдээлэл" },
              ]}
            />
          </Form.Item>
        )}
      </div>

      <Form.Item name="message" label="Зурвас">
        <TextArea rows={4} placeholder="Таны хүсэлт, асуулт..." />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        loading={loading}
        className={styles.submit}
      >
        Хүсэлт илгээх
      </Button>
    </Form>
  );
}
