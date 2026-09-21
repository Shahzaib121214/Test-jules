import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
