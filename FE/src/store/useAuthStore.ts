import { create } from 'zustand';

type AuthStore = {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  setIsLogin: (isLogin: boolean) => {
    set({ isLogin });
  },
}));

export default useAuthStore;
