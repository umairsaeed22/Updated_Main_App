import { create } from 'zustand';

const getSessionState = () => {
  const savedState = sessionStorage.getItem('otherDepartmentsState');
  return savedState ? JSON.parse(savedState) : false;
};

const useLayoutStore = create((set) => ({
  isOtherDepartment: getSessionState(),
  setIsOtherDepartment: (newState) => {
    set({ isOtherDepartment: newState });
    sessionStorage.setItem('otherDepartmentsState', JSON.stringify(newState));
  },
}));

export default useLayoutStore;
