import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  name: string;
  price: number; // yalnız göstərmək üçün, əsl qiyməti server hesablayır
  imageUrl: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export const CART_KEY = "cart";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

const initialState: CartState = { items: readCart() };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) {
      const { quantity = 1, ...item } = action.payload;
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) existing.quantity += quantity;
      else state.items.push({ ...item, quantity });
    },
    increment(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.quantity += 1;
    },
    decrement(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, increment, decrement, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;