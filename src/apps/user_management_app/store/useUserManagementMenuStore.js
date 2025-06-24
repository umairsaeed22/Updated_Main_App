import { create } from 'zustand';

const useUserManagementMenuStore = create((set) => ({
  selectedMenu: null,
  setSelectedMenu: (menuName) => set({ selectedMenu: menuName || null }),
}));

export default useUserManagementMenuStore;
