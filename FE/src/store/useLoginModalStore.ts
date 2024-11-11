import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  toggleModal: () => void;
};

const useLoginModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useLoginModalStore;
