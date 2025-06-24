import { create } from 'zustand';

const getDefaultMonthYear = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // ⭐ pad month here too
  const year = now.getFullYear();
  return `${month}-${year}`;
};

const getStoredOrDefault = () => {
  const stored = sessionStorage.getItem('selectedMonthYear');
  return stored || getDefaultMonthYear();
};

const useDateStore = create((set) => ({
  selectedMonthYear: getStoredOrDefault(),

  setSelectedMonthYear: (month, year) => {
    const formattedMonth = String(month).padStart(2, '0'); // ⭐ pad month
    const formatted = `${formattedMonth}-${year}`;
    sessionStorage.setItem('selectedMonthYear', formatted);
    set({ selectedMonthYear: formatted });
  },
}));

export default useDateStore;
