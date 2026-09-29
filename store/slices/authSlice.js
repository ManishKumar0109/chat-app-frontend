export const authSlice = (set, get) => ({
  userInfo: null,

  setUserInfo: (value) => set({ userInfo: value }),

  logout: () => set({ userInfo: null }),
});
