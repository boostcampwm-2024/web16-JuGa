import { useQuery } from '@tanstack/react-query';
import AccountCondition from './AccountCondition';
import MyStocksList from './MyStocksList';
import { getAssets } from 'service/assets';

export default function Account() {
  const { data, isLoading, isError } = useQuery(
    ['account', 'assets'],
    () => getAssets(),
    { staleTime: 1000 },
  );

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;
  if (isError) return <div>error</div>;

  const { asset, stocks } = data;

  return (
    <div className='flex min-h-[500px] flex-col gap-3'>
      <AccountCondition asset={asset} />
      <MyStocksList stocks={stocks} />
    </div>
  );
}
