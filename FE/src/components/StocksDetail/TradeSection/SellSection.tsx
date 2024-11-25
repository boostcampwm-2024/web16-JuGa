import Lottie from 'lottie-react';
import emptyAnimation from 'assets/emptyAnimation.json';
import { useQuery } from '@tanstack/react-query';
import { getSellPossibleStockCnt } from 'service/assets';
import { ChangeEvent, FocusEvent, FormEvent, useRef, useState } from 'react';
import { StockDetailType } from 'types';
import useAuthStore from 'store/authStore';
import useTradeAlertModalStore from 'store/tradeAlertModalStore';
import { isNumericString } from 'utils/common';

type SellSectionProps = {
  code: string;
  detailInfo: StockDetailType;
};

export default function SellSection({ code, detailInfo }: SellSectionProps) {
  const { stck_prpr, stck_mxpr, stck_llam, hts_kor_isnm } = detailInfo;

  const { data, isLoading, isError } = useQuery(
    ['detail', 'sellPosiible', code],
    () => getSellPossibleStockCnt(code),
  );

  const [currPrice, setCurrPrice] = useState<string>(stck_prpr);
  const { isLogin } = useAuthStore();
  const [count, setCount] = useState<number>(0);

  const [upperLimitFlag, setUpperLimitFlag] = useState<boolean>(false);
  const [lowerLimitFlag, setLowerLimitFlag] = useState<boolean>(false);
  const [cntFlag, setCntFlag] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const { isOpen, toggleModal } = useTradeAlertModalStore();

  if (isLoading) return <div>loading</div>;
  if (!data) return <div>No data</div>;
  if (isError) return <div>error</div>;

  const quantity = data.quantity;
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNumericString(e.target.value)) return;

    setCurrPrice(e.target.value);
  };

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

    // const price = +currPrice * count;

    // if (price > data.cash_balance) {
    //   setLackAssetFlag(true);
    //   timerRef.current = window.setTimeout(() => {
    //     setLackAssetFlag(false);
    //   }, 2000);
    //   return;
    // }
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
          <div className='flex justify-between'>
            <p>총 매도 금액</p>
            <p>{(+currPrice * count).toLocaleString()}원</p>
          </div>
        </div>

        <div className='flex flex-col justify-center h-10'></div>
        <button
          className={
            'rounded-lg bg-juga-blue-50 py-2 text-white disabled:bg-juga-grayscale-100'
          }
          disabled={!isLogin}
        >
          매도하기
        </button>
      </form>
    </>
  );
}
