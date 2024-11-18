export default function Overay({ onClick }: { onClick: () => void }) {
  return (
    <div className='fixed inset-0 bg-black opacity-30' onClick={onClick}></div>
  );
}
