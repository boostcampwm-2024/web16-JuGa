import useSearchModalStore from '../../store/useSearchModalStore.ts';
import Overay from '../../utils/ModalOveray.tsx';

export default function SearchModal() {
  const { isOpen, toggleSearchModal } = useSearchModalStore();

  if (!isOpen) return;

  return (
    <>
      <Overay onClick={() => toggleSearchModal()} />
      <section className='fixed left-1/2 top-[90px] flex w-[640px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-20 shadow-lg'></section>
    </>
  );
}
