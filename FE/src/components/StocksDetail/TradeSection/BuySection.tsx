import { ChangeEvent, FocusEvent, FormEvent, useRef, useState } from 'react';
import useTradeAlertModalStore from 'store/tradeAlertModalStore';
import { StockDetailType } from 'types';
import { isNumericString } from 'utils/common';
import useAuthStore from 'store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getCash } from 'service/assets';
import TradeAlertModal from './TradeAlertModal';

type BuySectionProps = {
  code: string;
  detailInfo: StockDetailType;
};

export default function BuySection({ code, detailInfo }: BuySectionProps) {
  const { stck_prpr, stck_mxpr, stck_llam, hts_kor_isnm } = detailInfo;

  const { data, isLoading, isError } = useQuery(['detail', 'cash'], () =>
    getCash(),
  );

  const [currPrice, setCurrPrice] = useState<string>(stck_prpr);
  const { isLogin } = useAuthStore();

  const { isOpen, toggleModal } = useTradeAlertModalStore();

  const [count, setCount] = useState<number>(0);

  const [upperLimitFlag, setUpperLimitFlag] = useState<boolean>(false);
  const [lowerLimitFlag, setLowerLimitFlag] = useState<boolean>(false);
  const [lackAssetFlag, setLackAssetFlag] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNumericString(e.target.value)) return;

    setCurrPrice(e.target.value);
  };

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;
  if (isError) return <div>error</div>;

  const handlePriceInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    const n = +e.target.value;
    if (n > +stck_mxpr) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setCurrPrice(stck_mxpr);

      setUpperLimitFlag(true);
      timerRef.current = window.setTimeout(() => {
        setUpperLimitFlag(false);
      }, 2000);
      return;
    }

    if (n < +stck_llam) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setCurrPrice(stck_llam);

      setLowerLimitFlag(true);
      timerRef.current = window.setTimeout(() => {
        setLowerLimitFlag(false);
      }, 2000);
      return;
    }
  };

  const handleBuy = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const price = +currPrice * count;

    if (price > data.cash_balance) {
      setLackAssetFlag(true);
      timerRef.current = window.setTimeout(() => {
        setLackAssetFlag(false);
      }, 2000);
      return;
    }
    toggleModal();
  };

  return (
    <>
      <form className='flex flex-col' onSubmit={handleBuy}>
        <div className='my-4'>
          <div className='flex items-center justify-between h-12'>
            <p className='mr-3 w-14'>매수 가격</p>
            <input
              type='text'
              value={currPrice}
              onChange={handlePriceChange}
              onBlur={handlePriceInputBlur}
              className='flex-1 py-1 rounded-lg'
            />
          </div>
          {lowerLimitFlag && (
            <div className='text-sm text-juga-red-60'>
              이 주식의 최소 가격은 {(+stck_llam).toLocaleString()}입니다.
            </div>
          )}
          {upperLimitFlag && (
            <div className='text-xs text-juga-red-60'>
              이 주식의 최대 가격은 {(+stck_mxpr).toLocaleString()}입니다.
            </div>
          )}
          <div className='flex items-center justify-between h-12'>
            <p className='mr-3 w-14'> 수량</p>
            <input
              type='number'
              value={count}
              onChange={(e) => setCount(+e.target.value)}
              className='flex-1 py-1 rounded-lg'
              min={1}
            />
          </div>
        </div>

        <div className='my-5 h-[0.5px] w-full bg-juga-grayscale-200'></div>

        <div className='flex flex-col gap-2'>
          <div className='flex justify-between'>
            <p>매수 가능 금액</p>
            <p>{data.cash_balance.toLocaleString()}원</p>
          </div>
          <div className='flex justify-between'>
            <p>총 주문 금액</p>
            <p>{(+currPrice * count).toLocaleString()}원</p>
          </div>
        </div>

        <div className='flex flex-col justify-center h-10'>
          {lackAssetFlag && (
            <p className='text-xs text-juga-red-60'>잔액이 부족해요!</p>
          )}
        </div>
        <button
          className={
            'rounded-lg bg-juga-red-60 py-2 text-white disabled:bg-juga-grayscale-100'
          }
          disabled={!isLogin}
        >
          매수하기
        </button>
      </form>
      {isOpen && (
        <TradeAlertModal
          code={code}
          stockName={hts_kor_isnm}
          price={currPrice}
          count={count}
        />
      )}
    </>
  );
}
