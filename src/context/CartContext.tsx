import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface AddToCartInput {
  product: Product;
  selectedFlavor?: string;
  quantity?: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (input: AddToCartInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'qiyutech_cart';
const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return [];

  try {
    return JSON.parse(value) as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());

  const persist = (nextItems: CartItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    setItems(nextItems);
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addToCart: ({ product, selectedFlavor, quantity = 1 }) => {
        const lineId = `${product.id}-${selectedFlavor ?? 'default'}`;
        const existing = items.find((item) => item.id === lineId);

        if (existing) {
          persist(
            items.map((item) =>
              item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          );
          return;
        }

        persist([
          ...items,
          {
            id: lineId,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
            selectedFlavor,
          },
        ]);
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          persist(items.filter((item) => item.id !== id));
          return;
        }

        persist(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
      },
      removeFromCart: (id) => persist(items.filter((item) => item.id !== id)),
      clearCart: () => persist([]),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
