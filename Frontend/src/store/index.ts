import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productsApi } from "./productsApi";
import { ordersApi } from "./ordersApi";
import authReducer from "./authSlice";
import cartReducer, { CART_STORAGE_KEY, clearShippingInfo } from "./cartSlice";
import { authApi } from "./authApi";
import { adminApi } from "./adminApi";
import { wishlistApi } from "./productsApi";

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      ordersApi.middleware,
      authApi.middleware,
      wishlistApi.middleware,
      adminApi.middleware
    ),
});

// Persist the cart so it survives page reloads.
let lastCart = store.getState().cart;
store.subscribe(() => {
  const cart = store.getState().cart;
  if (cart === lastCart) return;
  lastCart = cart;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage may be unavailable (private mode); the cart still works for this session
  }
});

// Drop cached per-user data when the logged-in user changes (logout, login,
// switching accounts) so one account never sees another account's data.
let lastUserId = store.getState().auth.user?._id ?? null;
store.subscribe(() => {
  const userId = store.getState().auth.user?._id ?? null;
  if (userId === lastUserId) return;
  const hadUser = lastUserId !== null;
  lastUserId = userId;

  store.dispatch(ordersApi.util.resetApiState());
  store.dispatch(wishlistApi.util.resetApiState());
  store.dispatch(authApi.util.resetApiState());
  store.dispatch(adminApi.util.resetApiState());
  store.dispatch(productsApi.util.invalidateTags(["Reviews"]));
  if (hadUser) store.dispatch(clearShippingInfo());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Enables the focus and reconnect refetch policies configured on productsApi.
setupListeners(store.dispatch);
