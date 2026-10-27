import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "../features/auth/authSlice";
import cartReducer, { CART_KEY, type CartState } from "../features/cart/cartSlice";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: (action) => action.type.startsWith("cart/"),
  effect: (_action, api) => {
    try {
      const { cart } = api.getState() as { cart: CartState };
      localStorage.setItem(CART_KEY, JSON.stringify(cart.items));
    } catch {
    }
  },
});

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefault) =>
    getDefault().prepend(listenerMiddleware.middleware).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;