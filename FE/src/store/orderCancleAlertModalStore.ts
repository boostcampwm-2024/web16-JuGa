import { Order } from 'types';
import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  order: Order | null;
  onSuccess: () => void;
  open: (order: Order, callback?: () => void) => void;
  close: () => void;
};

const useOrderAlertModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  order: null,
  onSuccess: () => {},
  open: (order, callback?) =>
    set(() => ({ isOpen: true, order, onSuccess: callback })),
  close: () => set(() => ({ isOpen: false })),
}));

export default useOrderAlertModalStore;
