"use client";

import { CheckCircleFilled, ShoppingOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SHOP_PARTNER } from "@/lib/portalShop";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import { usePortalShop } from "./PortalShopContext";
import shopStyles from "./PortalShop.module.css";
import portalStyles from "../Portal.module.css";
import styles from "../../dashboard/DashboardOverview.module.css";

type CheckoutForm = {
  contactName: string;
  phone: string;
  floor: string;
  office: string;
  notes: string;
  paymentMethod: "invoice" | "transfer" | "qpay";
};

export default function PortalShopCheckout() {
  const router = useRouter();
  const { lines, subtotal, deliveryFee, total, clearCart } = usePortalShop();
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [form] = Form.useForm<CheckoutForm>();

  if (!lines.length && !completed) {
    return (
      <main className={styles.page}>
        <section className={shopStyles.shopPage}>
          <div className={shopStyles.emptyState}>
            <h3>Сагс хоосон байна</h3>
            <p>Төлбөр төлөхийн өмнө бараа сонгоно уу.</p>
            <Link href="/portal/shop">
              <Button type="primary" icon={<ShoppingOutlined />}>
                Дэлгүүр рүү очих
              </Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (completed) {
    return (
      <main className={styles.page}>
        <section className={shopStyles.shopPage}>
          <div className={shopStyles.successCard}>
            <CheckCircleFilled style={{ fontSize: 48, color: "#16a34a" }} />
            <h2>Захиалга амжилттай</h2>
            <p>
              Таны захиалга <strong>{orderRef}</strong> дугаарт бүртгэгдлээ. Orgil Supermarket 24–48 цагийн
              дотор хүргэлт хийнэ.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
              <Link href="/portal/shop">
                <Button type="primary">Дэлгүүр рүү буцах</Button>
              </Link>
              <Link href="/portal">
                <Button>Overview руу очих</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const submitOrder = async () => {
    await form.validateFields();
    setSubmitting(true);
    window.setTimeout(() => {
      const ref = `ORG-${Date.now().toString().slice(-8)}`;
      setOrderRef(ref);
      clearCart();
      setCompleted(true);
      setSubmitting(false);
      message.success("Захиалга баталгаажлаа");
    }, 900);
  };

  return (
    <main className={styles.page}>
      <section className={shopStyles.shopPage}>
        <div className={portalStyles.pageHeader}>
          <div className={portalStyles.pageHeaderMain}>
            <span className={portalStyles.eyebrow}>Төлбөр</span>
            <h1>Захиалга баталгаажуулах</h1>
            <p className={portalStyles.pageSubtitle}>
              Хүргэлтийн мэдээлэл болон төлбөрийн аргаа сонгоод захиалга илгээнэ үү.
            </p>
          </div>
        </div>

        <div className={shopStyles.stepBar}>
          <div className={shopStyles.stepDone}>1. Бараа сонгох</div>
          <div className={shopStyles.stepDone}>2. Сагс</div>
          <div className={shopStyles.stepActive}>3. Төлбөр</div>
        </div>

        <div className={shopStyles.checkoutGrid}>
          <div className={shopStyles.formCard}>
            <h2>Хүргэлтийн мэдээлэл</h2>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                contactName: "",
                phone: "",
                floor: "4",
                office: "",
                notes: "",
                paymentMethod: "invoice",
              }}
            >
              <Form.Item name="contactName" label="Хариуцагч" rules={[{ required: true, message: "Нэр оруулна уу" }]}>
                <Input placeholder="Жишээ: Б.Болд" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Утас"
                rules={[{ required: true, message: "Утасны дугаар оруулна уу" }]}
              >
                <Input placeholder="9911-2233" />
              </Form.Item>
              <Form.Item name="floor" label="Давхар" rules={[{ required: true }]}>
                <Input placeholder="4" />
              </Form.Item>
              <Form.Item name="office" label="Оффис / талбай" rules={[{ required: true, message: "Оффисын дугаар оруулна уу" }]}>
                <Input placeholder="Жишээ: 4A, 12B" />
              </Form.Item>
              <Form.Item name="notes" label="Нэмэлт тэмдэглэл">
                <Input.TextArea rows={3} placeholder="Хүргэлтийн цаг, нэмэлт заавар..." />
              </Form.Item>

              <h2 style={{ marginTop: 8 }}>Төлбөрийн арга</h2>
              <Form.Item name="paymentMethod" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="invoice">Түрээслэгчийн нэхэмжлэхээр</Radio>
                  <Radio value="transfer">Дансаар шилжүүлэх</Radio>
                  <Radio value="qpay">QPay (demo)</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </div>

          <aside className={shopStyles.summaryCard}>
            <h2>Захиалгын дүн</h2>
            {lines.map((line) => (
              <div key={line.product.id} className={shopStyles.summaryRow}>
                <span>
                  {line.product.nameMn} × {line.quantity}
                </span>
                <strong>{formatMoneyDisplay(line.product.price * line.quantity)}</strong>
              </div>
            ))}
            <div className={shopStyles.summaryRow}>
              <span>Барааны дүн</span>
              <strong>{formatMoneyDisplay(subtotal)}</strong>
            </div>
            <div className={shopStyles.summaryRow}>
              <span>Хүргэлт ({SHOP_PARTNER.name})</span>
              <strong>{deliveryFee ? formatMoneyDisplay(deliveryFee) : "Үнэгүй"}</strong>
            </div>
            <div className={shopStyles.summaryRowTotal}>
              <span>Нийт төлөх</span>
              <strong>{formatMoneyDisplay(total)}</strong>
            </div>
            <p className={shopStyles.summaryNote}>{SHOP_PARTNER.deliveryNote}</p>
            <Button type="primary" block size="large" loading={submitting} onClick={submitOrder} style={{ marginTop: 16 }}>
              Захиалга илгээх
            </Button>
            <Button block style={{ marginTop: 10 }} onClick={() => router.push("/portal/shop/cart")}>
              Сагс руу буцах
            </Button>
          </aside>
        </div>
      </section>
    </main>
  );
}
