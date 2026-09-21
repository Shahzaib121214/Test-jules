import { create } from 'zustand';

export const useStoreSettings = create((set) => ({
  settings: {
    storeName: 'RehixPK',
    currency: 'PKR',
    maintenanceMode: false,
    heroTitle: 'Premium Gaming Deals',
    heroSubtitle: 'Buy game top-ups, gift cards, and digital goods at the best prices.',
  },
  isLoading: true,
  setSettings: (settings) => set({ settings }),
  setLoading: (isLoading) => set({ isLoading }),
}));
