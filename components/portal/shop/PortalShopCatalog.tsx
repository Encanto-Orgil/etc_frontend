"use client";

import { CheckOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button, message } from "antd";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  SHOP_CATEGORY_LABELS,
  SHOP_PARTNER,
  SHOP_PRODUCTS,
  type ShopCategory,
} from "@/lib/portalShop";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import { usePortalShop } from "./PortalShopContext";
import shopStyles from "./PortalShop.module.css";
import portalStyles from "../Portal.module.css";
import styles from "../../dashboard/DashboardOverview.module.css";

type CategoryFilter = ShopCategory | "all";

export default function PortalShopCatalog() {
  const { addItem, itemCount } = usePortalShop();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [addedId, setAddedId] = useState<string | null>(null);

  const products = useMemo(() => {
    if (category === "all") return SHOP_PRODUCTS;
    return SHOP_PRODUCTS.filter((product) => product.category === category);
  }, [category]);

  const handleAdd = (productId: string) => {
    addItem(productId);
    setAddedId(productId);
    message.success("Сагсанд нэмэгдлээ");
    window.setTimeout(() => setAddedId((current) => (current === productId ? null : current)), 1200);
  };

  return (
    <main className={styles.page}>
      <section className={shopStyles.shopPage}>
        <div className={portalStyles.pageHeader}>
          <div className={portalStyles.pageHeaderMain}>
            <span className={portalStyles.eyebrow}>Orgil Supermarket</span>
            <h1>Оффисын дэлгүүр</h1>
            <p className={portalStyles.pageSubtitle}>{SHOP_PARTNER.tagline}</p>
          </div>
        </div>

        <div className={shopStyles.partnerBanner}>
          <div>
            <strong>{SHOP_PARTNER.name}</strong>
            <p>{SHOP_PARTNER.deliveryNote}</p>
          </div>
          <span className={shopStyles.partnerBadge}>Demo</span>
        </div>

        <div className={shopStyles.toolbar}>
          <div className={shopStyles.categoryTabs}>
            <button
              type="button"
              className={category === "all" ? shopStyles.categoryTabActive : shopStyles.categoryTab}
              onClick={() => setCategory("all")}
            >
              Бүгд
            </button>
            {(Object.keys(SHOP_CATEGORY_LABELS) as ShopCategory[]).map((key) => (
              <button
                key={key}
                type="button"
                className={category === key ? shopStyles.categoryTabActive : shopStyles.categoryTab}
                onClick={() => setCategory(key)}
              >
                {SHOP_CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>

          <Link href="/portal/shop/cart" className={shopStyles.cartButton}>
            <Badge count={itemCount} size="small" offset={[4, -2]}>
              <ShoppingCartOutlined />
            </Badge>
            Сагс харах
          </Link>
        </div>

        <div className={shopStyles.productGrid}>
          {products.map((product) => (
            <article key={product.id} className={shopStyles.productCard}>
              <div className={shopStyles.productEmoji} aria-hidden>
                {product.emoji}
              </div>
              <p className={shopStyles.productCategory}>{SHOP_CATEGORY_LABELS[product.category]}</p>
              <h2 className={shopStyles.productName}>{product.nameMn}</h2>
              <p className={shopStyles.productDescription}>{product.description}</p>
              <div className={shopStyles.productFooter}>
                <div>
                  <div className={shopStyles.productPrice}>{formatMoneyDisplay(product.price)}</div>
                  <div className={shopStyles.productUnit}>/{product.unit}</div>
                </div>
                <Button
                  type="primary"
                  className={shopStyles.addButton}
                  icon={addedId === product.id ? <CheckOutlined /> : <ShoppingCartOutlined />}
                  onClick={() => handleAdd(product.id)}
                >
                  Нэмэх
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
