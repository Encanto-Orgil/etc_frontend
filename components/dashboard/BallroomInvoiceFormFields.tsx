"use client";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select, Typography } from "antd";
import type { FormInstance } from "antd/es/form";
import { useMemo } from "react";
import MoneyInput from "@/components/dashboard/MoneyInput";
import {
  computeInvoiceTotals,
  formatInvoiceMoney,
  VAT_MODE_LABELS,
  type VatMode,
} from "@/lib/ballroomInvoiceMath";
import styles from "./PropertyManagement.module.css";

export type InvoiceLineFormValue = {
  description: string;
  quantity: number;
  unit_price: number;
};

export type InvoiceFormValues = {
  booking?: number;
  issue_date?: unknown;
  due_date?: unknown;
  lines: InvoiceLineFormValue[];
  discount_amount: number;
  vat_mode: VatMode;
  status?: string;
  notes?: string;
};

type Props = {
  form: FormInstance;
  showBooking?: boolean;
  bookingOptions?: Array<{ value: number; label: string }>;
  bookingDisabled?: boolean;
};

export function InvoiceTotalsPreview({ form }: { form: FormInstance }) {
  const lines = Form.useWatch("lines", form) ?? [];
  const discountAmount = Form.useWatch("discount_amount", form) ?? 0;
  const vatMode = (Form.useWatch("vat_mode", form) ?? "included") as VatMode;

  const totals = useMemo(
    () =>
      computeInvoiceTotals(
        (lines as InvoiceLineFormValue[]).map((line) => ({
          quantity: Number(line?.quantity || 0),
          unit_price: Number(line?.unit_price || 0),
        })),
        Number(discountAmount || 0),
        vatMode,
      ),
    [lines, discountAmount, vatMode],
  );

  return (
    <div className={styles.invoiceTotals}>
      <Typography.Text type="secondary">Preview</Typography.Text>
      <div className={styles.invoicePreviewRows}>
        <div><span>Subtotal</span><strong>{formatInvoiceMoney(totals.subtotal)}</strong></div>
        <div><span>Discount</span><strong>-{formatInvoiceMoney(totals.discountAmount)}</strong></div>
        <div><span>Net (without VAT)</span><strong>{formatInvoiceMoney(totals.netAmount)}</strong></div>
        <div><span>VAT (10%)</span><strong>{formatInvoiceMoney(totals.vatAmount)}</strong></div>
        <div className={styles.invoicePreviewGrand}>
          <span>Total</span><strong>{formatInvoiceMoney(totals.total)}</strong>
        </div>
      </div>
    </div>
  );
}

export default function BallroomInvoiceFormFields({
  form,
  showBooking = false,
  bookingOptions = [],
  bookingDisabled = false,
}: Props) {
  return (
    <>
      {showBooking ? (
        <Form.Item name="booking" label="Booking" rules={[{ required: true }]}>
          <Select
            showSearch
            optionFilterProp="label"
            options={bookingOptions}
            disabled={bookingDisabled}
          />
        </Form.Item>
      ) : null}

      <Form.List
        name="lines"
        rules={[
          {
            validator: async (_, lines) => {
              if (!lines || lines.length < 1) {
                throw new Error("Add at least one service line.");
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <strong>Service lines</strong>
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => add({ quantity: 1, unit_price: 0, description: "" })}>
                Add row
              </Button>
            </div>
            {fields.map((field) => (
              <Row gutter={8} key={field.key} align="middle" style={{ marginBottom: 8 }}>
                <Col flex="auto">
                  <Form.Item
                    {...field}
                    name={[field.name, "description"]}
                    rules={[{ required: true, message: "Description required" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input placeholder="Service description" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    {...field}
                    name={[field.name, "quantity"]}
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0 }}
                  >
                    <InputNumber min={0.01} step={1} style={{ width: "100%" }} placeholder="Qty" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    {...field}
                    name={[field.name, "unit_price"]}
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0 }}
                  >
                    <MoneyInput style={{ width: "100%" }} placeholder="Unit price" />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    disabled={fields.length <= 1}
                    onClick={() => remove(field.name)}
                  />
                </Col>
              </Row>
            ))}
          </div>
        )}
      </Form.List>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item name="discount_amount" label="Discount" initialValue={0}>
            <MoneyInput style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="vat_mode" label="VAT mode" initialValue="included">
            <Select
              options={(Object.keys(VAT_MODE_LABELS) as VatMode[]).map((value) => ({
                value,
                label: VAT_MODE_LABELS[value],
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <InvoiceTotalsPreview form={form} />
    </>
  );
}

export function buildInvoicePayload(values: InvoiceFormValues) {
  const lines = (values.lines ?? []).map((line, index) => ({
    description: line.description,
    quantity: line.quantity,
    unit_price: line.unit_price,
    order: index,
  }));

  return {
    lines,
    discount_amount: values.discount_amount ?? 0,
    vat_mode: values.vat_mode ?? "included",
    notes: values.notes || "",
  };
}
