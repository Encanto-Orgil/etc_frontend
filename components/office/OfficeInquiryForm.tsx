"use client";

import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { submitInquiry } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import formStyles from "@/components/InquiryForm.module.css";
import styles from "./OfficeInquiryForm.module.css";

const { TextArea } = Input;

type OfficeLeasingFormValues = {
  companyName: string;
  contactPerson: string;
  businessType?: string;
  email: string;
  telephone: string;
  altTelephone?: string;
  officeSize?: string;
  employees?: string;
  moveInDate?: string;
  durationYears?: string;
  otherEnquiries?: string;
};

function buildLeasingMessage(values: OfficeLeasingFormValues): string {
  const lines = [
    `Company: ${values.companyName}`,
    values.businessType ? `Business type: ${values.businessType}` : null,
    values.altTelephone ? `Alternative phone: ${values.altTelephone}` : null,
    values.officeSize ? `Expected office size: ${values.officeSize}` : null,
    values.employees ? `Expected employees: ${values.employees}` : null,
    values.moveInDate ? `Move-in date: ${values.moveInDate}` : null,
    values.durationYears ? `Expected duration: ${values.durationYears} years` : null,
    values.otherEnquiries ? `\nOther enquiries:\n${values.otherEnquiries}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export default function OfficeInquiryForm() {
  const copy = useTranslations().office.leasingForm;
  const [form] = Form.useForm<OfficeLeasingFormValues>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onFinish = async (values: OfficeLeasingFormValues) => {
    setLoading(true);
    try {
      await submitInquiry({
        name: values.contactPerson,
        phone: values.telephone,
        email: values.email,
        interest: "office",
        message: values.otherEnquiries?.trim() || buildLeasingMessage(values),
        leasing_details: {
          company_name: values.companyName,
          business_type: values.businessType,
          alt_phone: values.altTelephone,
          office_size: values.officeSize,
          employees: values.employees,
          move_in_date: values.moveInDate,
          duration_years: values.durationYears,
        },
      });
      setDone(true);
      form.resetFields();
      message.success(copy.successToast);
    } catch {
      message.error(copy.errorToast);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={formStyles.done}>
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
      className={`${formStyles.form} ${styles.form}`}
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        name="companyName"
        label={copy.companyName}
        rules={[{ required: true, message: copy.companyNameRequired }]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="contactPerson"
        label={copy.contactPerson}
        rules={[{ required: true, message: copy.contactPersonRequired }]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item name="businessType" label={copy.businessType}>
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label={copy.email}
        rules={[
          { required: true, message: copy.emailRequired },
          { type: "email", message: copy.emailInvalid },
        ]}
      >
        <Input size="large" />
      </Form.Item>

      <div className={formStyles.row}>
        <Form.Item
          name="telephone"
          label={copy.telephone}
          rules={[{ required: true, message: copy.telephoneRequired }]}
        >
          <Input placeholder="99xxxxxx" size="large" />
        </Form.Item>

        <Form.Item name="altTelephone" label={copy.altTelephone}>
          <Input placeholder="99xxxxxx" size="large" />
        </Form.Item>
      </div>

      <div className={formStyles.row}>
        <Form.Item name="officeSize" label={copy.officeSize}>
          <Input size="large" />
        </Form.Item>

        <Form.Item name="employees" label={copy.employees}>
          <Input size="large" />
        </Form.Item>
      </div>

      <div className={formStyles.row}>
        <Form.Item name="moveInDate" label={copy.moveInDate}>
          <Input size="large" />
        </Form.Item>

        <Form.Item name="durationYears" label={copy.durationYears}>
          <Input size="large" />
        </Form.Item>
      </div>

      <Form.Item name="otherEnquiries" label={copy.otherEnquiries}>
        <TextArea rows={4} />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        loading={loading}
        className={formStyles.submit}
      >
        {copy.submit}
      </Button>
    </Form>
  );
}
