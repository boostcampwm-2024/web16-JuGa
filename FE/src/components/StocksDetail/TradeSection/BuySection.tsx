import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useTradeAlertModalStore from 'store/useTradeAlertModalStore';
import { StockDetailType } from 'types';
import { isNumericString } from 'utils/common';
import useAuthStore from 'store/useAuthStore.ts';
import { useQuery } from '@tanstack/react-query';
import { getCash } from 'service/assets';
import TradeAlertModal from './TradeAlertModal';
import Loading from 'components/Loading';

type BuySectionProps = {
  code: string;
  detailInfo: StockDetailType;
};

export default function BuySection({ code, detailInfo }: BuySectionProps) {
  const { stck_prpr, stck_mxpr, stck_llam, hts_kor_isnm } = detailInfo;

  const { data, isLoading } = useQuery(['detail', 'cash'], () => getCash(), {
    staleTime: 1000,
  });

  const [currPrice, setCurrPrice] = useState<string>(stck_prpr);
  const { isLogin } = useAuthStore();

  useEffect(() => {
    setCurrPrice(stck_prpr);
  }, [stck_prpr]);

  const { isOpen, toggleModal } = useTradeAlertModalStore();

  const [count, setCount] = useState<number>(1);

  const [upperLimitFlag, setUpperLimitFlag] = useState<boolean>(false);
  const [lowerLimitFlag, setLowerLimitFlag] = useState<boolean>(false);
  const [lackAssetFlag, setLackAssetFlag] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const handlePriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value.replace(/,/g, '');
    if (!isNumericString(s)) return;
    setCurrPrice(s);
  }, []);

  const handleCountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    if (!isNumericString(s)) return;
    setCount(+s);
  }, []);

  if (isLoading) return <Loading />;
  if (!data) return <div>No data</div>;

  const handlePriceInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    const n = +e.target.value.replace(/,/g, '');

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
      <form
        className='flex flex-col'
        onSubmit={handleBuy}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        <div className='my-4'>
          <div className='flex items-center justify-between h-12'>
            <p className='mr-3 w-14'>매수 가격</p>
            <input
              type='text'
              value={(+currPrice).toLocaleString()}
              onChange={handlePriceChange}
              onBlur={handlePriceInputBlur}
              className='flex-1 py-1 rounded-lg'
            />
          </div>
          {lowerLimitFlag && (
            <div className='text-xs text-juga-red-60'>
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
              type='text'
              value={count}
              onChange={handleCountChange}
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
          disabled={!isLogin || count === 0}
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
          type='BUY'
        />
      )}
    </>
  );
}
