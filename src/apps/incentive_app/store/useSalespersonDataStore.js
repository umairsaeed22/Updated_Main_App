import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
const useSalespersonDataStore = create(
  devtools((set) => ({
    salespersonData: null,
    isLoading: true,
    error: null,
    setSalespersonData: (data) =>
      set({ salespersonData: data, isLoading: false, error: null }),
    setLoading: () => set({ isLoading: true, error: null }),
    setError: (error) =>
      set({ salespersonData: null, isLoading: false, error }),
  })),
);
export default useSalespersonDataStore;
