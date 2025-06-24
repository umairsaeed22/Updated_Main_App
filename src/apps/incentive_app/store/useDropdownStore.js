import { create } from 'zustand';

const useDropdownStore = create((set) => ({
  openDropDown: null,

  setOpenDropDown: (name) => set({ openDropDown: name }),
  closeDropDown: () => set({ openDropDown: null }),
}));

export default useDropdownStore;
