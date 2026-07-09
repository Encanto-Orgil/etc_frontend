"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  calcDeliveryFee,
  getProductById,
  SHOP_PARTNER,
  type ShopProduct,
} from "@/lib/portalShop";

const CART_STORAGE_KEY = "portal-shop-cart";

export type CartLine = {
  product: ShopProduct;
  quantity: number;
};

type CartState = Record<string, number>;

type PortalShopContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const PortalShopContext = createContext<PortalShopContextValue | null>(null);

function readStoredCart(): CartState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CartState;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredCart(cart: CartState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function PortalShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});

  useEffect(() => {
    setCart(readStoredCart());
  }, []);

  const persist = useCallback((next: CartState) => {
    setCart(next);
    writeStoredCart(next);
  }, []);

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      persist({
        ...cart,
        [productId]: Math.min(99, (cart[productId] || 0) + quantity),
      });
    },
    [cart, persist],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const next = { ...cart };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = Math.min(99, quantity);
      }
      persist(next);
    },
    [cart, persist],
  );

  const removeItem = useCallback(
    (productId: string) => {
      const next = { ...cart };
      delete next[productId];
      persist(next);
    },
    [cart, persist],
  );

  const clearCart = useCallback(() => {
    persist({});
  }, [persist]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([productId, quantity]) => {
          const product = getProductById(productId);
          if (!product || quantity <= 0) return null;
          return { product, quantity };
        })
        .filter((line): line is CartLine => line !== null),
    [cart],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [lines],
  );

  const deliveryFee = useMemo(() => calcDeliveryFee(subtotal), [subtotal]);
  const total = subtotal + deliveryFee;

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [lines, itemCount, subtotal, deliveryFee, total, addItem, setQuantity, removeItem, clearCart],
  );

  return <PortalShopContext.Provider value={value}>{children}</PortalShopContext.Provider>;
}

export function usePortalShop() {
  const context = useContext(PortalShopContext);
  if (!context) {
    throw new Error("usePortalShop must be used within PortalShopProvider");
  }
  return context;
}

export { SHOP_PARTNER };
