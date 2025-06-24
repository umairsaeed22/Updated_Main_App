import { create } from 'zustand';

const useUserManagementModalStore = create((set) => ({
  selectedModal: null,
  setSelectedModal: (modalName) => set({ selectedModal: modalName || null }),
}));

export default useUserManagementModalStore;
