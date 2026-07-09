"use client";

import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, InputNumber } from "antd";
import Link from "next/link";
import { SHOP_PARTNER } from "@/lib/portalShop";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import { usePortalShop } from "./PortalShopContext";
import PortalShopProductImage from "./PortalShopProductImage";
import shopStyles from "./PortalShop.module.css";
import portalStyles from "../Portal.module.css";
import styles from "../../dashboard/DashboardOverview.module.css";

export default function PortalShopCart() {
  const { lines, subtotal, discountAmount, deliveryFee, total, setQuantity, removeItem } = usePortalShop();

  if (!lines.length) {
    return (
      <main className={styles.page}>
        <section className={shopStyles.shopPage}>
          <div className={portalStyles.pageHeader}>
            <div className={portalStyles.pageHeaderMain}>
              <span className={portalStyles.eyebrow}>Сагс</span>
              <h1>Таны сагс хоосон байна</h1>
            </div>
          </div>
          <div className={shopStyles.emptyState}>
            <h3>Бараа сонгоогүй байна</h3>
            <p>Orgil Supermarket-аас оффисын хэрэгцээт бараагаа сонгоод сагсанд нэмнэ үү.</p>
            <Link href="/portal/shop">
              <Button type="primary" icon={<ShoppingOutlined />}>
                Дэлгүүр рүү буцах
              </Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={shopStyles.shopPage}>
        <div className={portalStyles.pageHeader}>
          <div className={portalStyles.pageHeaderMain}>
            <span className={portalStyles.eyebrow}>Сагс</span>
            <h1>Захиалгын сагс</h1>
            <p className={portalStyles.pageSubtitle}>Барааны тоо хэмжээг шалгаад төлбөр төлөх хэсэг рүү үргэлжлүүлнэ үү.</p>
          </div>
        </div>

        <div className={shopStyles.stepBar}>
          <div className={shopStyles.stepDone}>1. Бараа сонгох</div>
          <div className={shopStyles.stepActive}>2. Сагс</div>
          <div className={shopStyles.step}>3. Төлбөр</div>
        </div>

        <div className={shopStyles.layoutTwoCol}>
          <div className={shopStyles.cartList}>
            {lines.map((line) => (
              <div key={line.product.id} className={shopStyles.cartRow}>
                <PortalShopProductImage
                  src={line.product.imageUrl}
                  alt={line.product.nameMn}
                  className={shopStyles.cartThumb}
                />
                <div className={shopStyles.cartInfo}>
                  <strong>{line.product.nameMn}</strong>
                  <span>
                    {formatMoneyDisplay(line.product.price)} / {line.product.unit}
                  </span>
                </div>
                <div className={shopStyles.cartActions}>
                  <InputNumber
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(value) => setQuantity(line.product.id, Number(value) || 1)}
                  />
                  <strong>{formatMoneyDisplay(line.product.price * line.quantity)}</strong>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(line.product.id)}
                  >
                    Устгах
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <aside className={shopStyles.summaryCard}>
            <h2>Захиалгын дүн</h2>
            <div className={shopStyles.summaryRow}>
              <span>Барааны дүн</span>
              <strong>{formatMoneyDisplay(subtotal)}</strong>
            </div>
            <div className={shopStyles.summaryRow}>
              <span>Хөнгөлөлт ({SHOP_PARTNER.discountPercent}%)</span>
              <strong className={shopStyles.discountValue}>-{formatMoneyDisplay(discountAmount)}</strong>
            </div>
            <div className={shopStyles.summaryRow}>
              <span>Хүргэлт</span>
              <strong>{deliveryFee ? formatMoneyDisplay(deliveryFee) : "Үнэгүй"}</strong>
            </div>
            <div className={shopStyles.summaryRowTotal}>
              <span>Нийт</span>
              <strong>{formatMoneyDisplay(total)}</strong>
            </div>
            <p className={shopStyles.summaryNote}>{SHOP_PARTNER.discountMessage}</p>
            <p className={shopStyles.summaryNote}>
              {subtotal >= SHOP_PARTNER.freeDeliveryFrom
                ? `${formatMoneyDisplay(SHOP_PARTNER.freeDeliveryFrom)}-аас дээш захиалгад хүргэлт үнэгүй.`
                : `Хүргэлт үнэгүй болгох доод дүн: ${formatMoneyDisplay(SHOP_PARTNER.freeDeliveryFrom)}.`}
            </p>
            <Link href="/portal/shop/checkout" style={{ display: "block", marginTop: 16 }}>
              <Button type="primary" block size="large" disabled={subtotal < SHOP_PARTNER.minOrder}>
                Төлбөр төлөх
              </Button>
            </Link>
            {subtotal < SHOP_PARTNER.minOrder ? (
              <p className={shopStyles.summaryNote}>
                Хамгийн бага захиалга: {formatMoneyDisplay(SHOP_PARTNER.minOrder)}
              </p>
            ) : null}
            <Link href="/portal/shop" style={{ display: "block", marginTop: 10 }}>
              <Button block>Дэлгүүр рүү буцах</Button>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
