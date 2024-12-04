import Lottie from 'lottie-react';
import emptyAnimation from 'assets/emptyAnimation.json';
import { useQuery } from '@tanstack/react-query';
import { getSellInfo } from 'service/assets';
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StockDetailType } from 'types';
import useAuthStore from 'store/useAuthStore.ts';
import useTradeAlertModalStore from 'store/useTradeAlertModalStore';
import { calcYield, isNumericString } from 'utils/common';
import TradeAlertModal from './TradeAlertModal';

type SellSectionProps = {
  code: string;
  detailInfo: StockDetailType;
};

export default function SellSection({ code, detailInfo }: SellSectionProps) {
  const { stck_prpr, stck_mxpr, stck_llam, hts_kor_isnm } = detailInfo;

  const { data, isLoading, isError } = useQuery(
    ['detail', 'sellPosiible', code],
    () => getSellInfo(code),
    { staleTime: 1000 },
  );

  const [currPrice, setCurrPrice] = useState<string>(stck_prpr);
  const { isLogin } = useAuthStore();
  const [count, setCount] = useState<number>(1);

  const [upperLimitFlag, setUpperLimitFlag] = useState<boolean>(false);
  const [lowerLimitFlag, setLowerLimitFlag] = useState<boolean>(false);
  const [cntFlag, setCntFlag] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const { isOpen, toggleModal } = useTradeAlertModalStore();

  useEffect(() => {
    setCurrPrice(stck_prpr);
  }, [stck_prpr]);

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

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;
  if (isError) return <div>error</div>;

  const quantity = data.quantity;
  const avg_price = Math.floor(data.avg_price);

  const pl = (+currPrice - avg_price) * count;
  const totalPrice = +currPrice * count;
  const plRate = calcYield(avg_price, +currPrice);

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

  const handleCntInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    const n = +e.target.value;
    if (n > quantity) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setCount(quantity);

      setCntFlag(true);
      timerRef.current = window.setTimeout(() => {
        setCntFlag(false);
      }, 2000);
    }
  };

  const handleSell = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toggleModal();
  };

  if (!isLogin || quantity === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <Lottie
          animationData={emptyAnimation}
          className='w-40 h-40'
          loop={false}
        />
        <p>매도할 주식이 없어요</p>
      </div>
    );
  }

  return (
    <>
      <form className='flex flex-col' onSubmit={handleSell}>
        <div className='my-4'>
          <div className='flex items-center justify-between h-12'>
            <p className='mr-3 w-14'>매도 가격</p>
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
              onBlur={handleCntInputBlur}
              className='flex-1 py-1 rounded-lg'
              min={1}
              max={quantity}
            />
          </div>
          {cntFlag && (
            <div className='text-xs text-juga-red-60'>
              {quantity}주 까지 판매할 수 있어요.
            </div>
          )}
        </div>

        <div className='my-5 h-[0.5px] w-full bg-juga-grayscale-200'></div>

        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <p>예상 수익률</p>
              <p
                className={`${plRate < 0 ? 'text-juga-blue-50' : 'text-juga-red-60'}`}
              >
                {plRate.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <p>예상 손익</p>
              <p>{pl.toLocaleString()}원</p>
            </div>
          </div>
          <div className='flex justify-between'>
            <p>총 매도 금액</p>
            <p>{totalPrice.toLocaleString()}원</p>
          </div>
        </div>
        <div className='flex flex-col justify-center h-10'></div>
        <button
          className={
            'rounded-lg bg-juga-blue-50 py-2 text-white disabled:bg-juga-grayscale-100'
          }
          disabled={!isLogin || count === 0}
        >
          매도하기
        </button>
      </form>
      {isOpen && (
        <TradeAlertModal
          code={code}
          stockName={hts_kor_isnm}
          price={currPrice}
          count={count}
          type='SELL'
        />
      )}
    </>
  );
}
