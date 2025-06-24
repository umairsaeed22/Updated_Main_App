import { create } from 'zustand';

const useUserManagementUsersInfoStore = create((set) => ({
  userInfo: {
    fileNumber: null,
    name: '',
    region: '',
    location: '',
    imageURL: '',
    department: '',
    position: '',
    apps: [],
  },

  // Safely update parts of userInfo
  setUserInfo: (info) =>
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        ...info,
      },
    })),

  // Reset all fields to initial
  resetUserInfo: () =>
    set(() => ({
      userInfo: {
        fileNumber: null,
        name: '',
        region: '',
        location: '',
        imageURL: '',
        department: '',
        position: '',
        apps: [],
      },
    })),
}));

export default useUserManagementUsersInfoStore;
