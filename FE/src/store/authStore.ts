import { create } from 'zustand';

type AuthStore = {
  accessToken: string | null;
  isLogin: boolean;
  setAccessToken: (token: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  resetToken: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  isLogin: false,
  setIsLogin: (isLogin: boolean) => {
    set({ isLogin });
  },
  setAccessToken: (token: string) => {
    set({ accessToken: token, isLogin: token !== null });
  },
  resetToken: () => {
    set({ accessToken: null, isLogin: false });
  },
}));

export default useAuthStore;
