import { useQuery } from '@tanstack/react-query';
import AccountCondition from './AccountCondition';
import MyStocksList from './MyStocksList';
import { getAssets } from 'service/assets';
import { isWithinTimeRange } from 'utils/common';

export default function Account() {
  const { data, isLoading, isError } = useQuery(
    ['account', 'assets'],
    () => getAssets(),
    {
      staleTime: 1000,
      refetchInterval: isWithinTimeRange('09:00', '15:30') ? 5000 : false,
    },
  );

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;
  if (isError) return <div>error</div>;

  const { asset, stocks } = data;

  console.log(asset, stocks);

  return (
    <div className='flex min-h-[500px] flex-col gap-3'>
      <AccountCondition asset={asset} />
      <MyStocksList stocks={stocks} />
    </div>
  );
}
