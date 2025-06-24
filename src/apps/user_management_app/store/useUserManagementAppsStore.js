import { create } from 'zustand';

const useUserManagementAppsStore = create((set) => ({
  availableApps: [],
  departmentName: null,
  departmentCode: null,

  setAvailableApps: ({ apps, name, code }) =>
    set({
      availableApps: apps || [],
      departmentName: name || null,
      departmentCode: code || null,
    }),

  clearAvailableApps: () =>
    set({
      availableApps: [],
      departmentName: null,
      departmentCode: null,
    }),
}));

export default useUserManagementAppsStore;
