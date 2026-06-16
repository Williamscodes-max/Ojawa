import { create } from 'zustand';
import api from '../api/axios';

const useCartStore = create((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/cart/');
      set({ cart: res.data });
    } catch {
      set({ cart: null });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product_id, quantity = 1) => {
    const res = await api.post('/cart/add/', { product_id, quantity });
    set({ cart: res.data });
  },

  removeFromCart: async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}/delete/`);
    set({ cart: res.data });
  },

  updateQuantity: async (itemId, quantity) => {
    const res = await api.patch(`/cart/items/${itemId}/update/`, { quantity });
    set({ cart: res.data });
  },

  clearCart: () => set({ cart: null }),
}));

export default useCartStore;