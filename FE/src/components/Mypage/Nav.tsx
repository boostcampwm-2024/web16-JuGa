import { useSearchParams } from 'react-router-dom';
import { MypageSectionType } from 'types';

const mapping = {
  account: '보유 자산 현황',
  info: '내 정보',
};
const sections: MypageSectionType[] = ['account', 'info'];

export default function Nav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSection = searchParams.get('section') || 'account';

  const handleClick = (section: MypageSectionType) => {
    setSearchParams({ section });
  };

  return (
    <div className='flex flex-col w-48 rounded-lg h-fit'>
      {sections.map((e) => (
        <button
          onClick={() => handleClick(e)}
          className={`h-20 rounded-xl font-semibold ${currentSection === e ? 'bg-gray-100' : 'transition hover:bg-gray-50'}`}
        >
          {mapping[e]}
        </button>
      ))}
    </div>
  );
}
