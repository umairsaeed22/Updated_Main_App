import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGRNStore = create(
  persist(
    (set) => ({
      grnData: null,
      grnNumber: '',

      // Set full GRN data and number
      setGrnData: (data, grnNumber) => set({ grnData: data, grnNumber }),

      // Clear data
      clearGrnData: () => set({ grnData: null, grnNumber: '' }),

      // Add method to update a single item
      updateItemByRefNo: (refNo, updatedFields) =>
        set((state) => {
          const updatedItems = state.grnData.item.map((item) =>
            item.refNo === refNo ? { ...item, ...updatedFields } : item
          );
          return {
            grnData: {
              ...state.grnData,
              item: updatedItems,
            },
          };
        }),
    }),
    {
      name: 'grn-storage', // Key in localStorage
      getStorage: () => localStorage,
    }
  )
);
