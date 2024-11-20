import AccountCondition from './AccountCondition';
import MyStocksList from './MyStocksList';

export default function Account() {
  return (
    <div className='flex flex-col gap-3'>
      <AccountCondition />
      <MyStocksList />
    </div>
  );
}
