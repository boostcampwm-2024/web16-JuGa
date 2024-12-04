import { useSearchParams } from 'react-router-dom';
import { MypageSectionType } from './type.ts';

const mapping = {
  account: '보유 자산 현황',
  order: '주문 요청 현황',
  bookmark: '즐겨찾기',
  info: '내 정보',
};
const sections: MypageSectionType[] = ['account', 'order', 'bookmark', 'info'];

export default function Nav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSection = searchParams.get('section') || 'account';

  const handleClick = (section: MypageSectionType) => {
    setSearchParams({ section });
  };

  return (
    <div className='flex h-fit w-48 flex-col rounded-lg'>
      {sections.map((e, idx) => (
        <button
          key={`assetNav${idx}`}
          onClick={() => handleClick(e)}
          className={`h-20 rounded-xl font-semibold ${currentSection === e ? 'bg-gray-100' : 'transition hover:bg-gray-50'}`}
        >
          {mapping[e]}
        </button>
      ))}
    </div>
  );
}
