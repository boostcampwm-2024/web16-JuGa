import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  toggleSearchModal: () => void;
};

const useSearchModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  toggleSearchModal: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSearchModalStore;
