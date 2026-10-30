import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ShippingInfo } from "./ordersApi";

export interface CartItem {
  product: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingInfo: ShippingInfo | null;
}

export const CART_STORAGE_KEY = "shopit_cart";

function loadCart(): CartState {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        shippingInfo: parsed.shippingInfo ?? null,
      };
    }
  } catch {
    // Ignore unreadable storage and start with an empty cart
  }
  return { items: [], shippingInfo: null };
}

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find((i) => i.product === item.product);
      if (existing) {
        existing.stock = item.stock;
        existing.price = item.price;
        existing.quantity = Math.min(existing.quantity + item.quantity, item.stock);
      } else {
        state.items.push({ ...item, quantity: Math.min(item.quantity, item.stock) });
      }
    },
    updateQuantity(state, action: PayloadAction<{ product: string; quantity: number }>) {
      const item = state.items.find((i) => i.product === action.payload.product);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock));
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    saveShippingInfo(state, action: PayloadAction<ShippingInfo>) {
      state.shippingInfo = action.payload;
    },
    clearShippingInfo(state) {
      state.shippingInfo = null;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, saveShippingInfo, clearShippingInfo } =
  cartSlice.actions;
export default cartSlice.reducer;

// Mirrors the server's pricing in Backend/controllers/orderControllers.ts (newOrder).
// The server recalculates on checkout, so this is for display only.
export function calcOrderPrices(items: CartItem[]) {
  const round = (n: number) => Math.round(n * 100) / 100;
  const itemsPrice = round(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const shippingAmount = itemsPrice > 100 ? 0 : 25;
  const taxAmount = round(itemsPrice * 0.15);
  const totalAmount = round(itemsPrice + shippingAmount + taxAmount);
  return { itemsPrice, shippingAmount, taxAmount, totalAmount };
}
