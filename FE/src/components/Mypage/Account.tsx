import { useQuery } from '@tanstack/react-query';
import AccountCondition from './AccountCondition';
import MyStocksList from './MyStocksList';
import { getAssets } from 'service/assets';
import { isWithinTimeRange } from 'utils/common';
import useAuthStore from 'store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { data, isLoading } = useQuery(
    ['account', 'assets'],
    () => getAssets(),
    {
      staleTime: 1000,
      refetchInterval: isWithinTimeRange('09:00', '15:30') ? 5000 : false,
    },
  );

  const navigate = useNavigate();
  const { isLogin } = useAuthStore();
  if (!isLogin) {
    navigate('/');
  }

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;

  const { asset, stocks } = data;

  return (
    <div className='flex min-h-[500px] flex-col gap-3'>
      <AccountCondition asset={asset} />
      <MyStocksList stocks={stocks} />
    </div>
  );
}
