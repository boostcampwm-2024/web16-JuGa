import { HeartIcon } from '@heroicons/react/16/solid';
import { useEffect, useRef, useState } from 'react';
import { bookmark, unbookmark } from 'service/bookmark';
import { unsubscribe } from 'service/stocks';
import useAuthStore from 'store/authStore';
import { StockDetailType } from 'types';
import { stringToLocaleString } from 'utils/common';
import { socket } from 'utils/socket';
import { useDebounce } from 'utils/useDebounce';

type StocksDetailHeaderProps = {
  code: string;
  data: StockDetailType;
};

export default function Header({ code, data }: StocksDetailHeaderProps) {
  const {
    hts_kor_isnm,
    stck_prpr,
    prdy_vrss,
    prdy_vrss_sign,
    prdy_ctrt,
    hts_avls,
    per,
    is_bookmarked,
  } = data;

  const [currPrice, setCurrPrice] = useState(stck_prpr);
  const [currPrdyVrssSign, setCurrPrdyVrssSign] = useState(prdy_vrss_sign);
  const [currPrdyVrss, setCurrPrdyVrss] = useState(prdy_vrss);
  const [currPrdyRate, setCurrPrdyRate] = useState(prdy_ctrt);
  const [isBookmarked, setIsBookmarked] = useState(is_bookmarked);
  const { isLogin } = useAuthStore();

  const { debounceValue } = useDebounce(isBookmarked, 1000);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceValue) {
      bookmark(code);
    } else {
      unbookmark(code);
    }
  }, [code, debounceValue]);

  useEffect(() => {
    const handleSocketData = (data: {
      stck_prpr: string;
      prdy_vrss: string;
      prdy_vrss_sign: string;
      prdy_ctrt: string;
    }) => {
      const { stck_prpr, prdy_vrss, prdy_vrss_sign, prdy_ctrt } = data;
      setCurrPrice(stck_prpr);
      setCurrPrdyVrss(prdy_vrss);
      setCurrPrdyVrssSign(prdy_vrss_sign);
      setCurrPrdyRate(prdy_ctrt);
    };

    socket.on(`detail/${code}`, handleSocketData);

    return () => {
      socket.off(`detail/${code}`, handleSocketData);
      unsubscribe(code);
    };
  }, [code]);

  const stockInfo: { label: string; value: string }[] = [
    { label: '시총', value: `${Number(hts_avls).toLocaleString()}억원` },
    { label: 'PER', value: `${per}배` },
  ];

  const colorStyleBySign =
    currPrdyVrssSign === '3'
      ? ''
      : currPrdyVrssSign < '3'
        ? 'text-juga-red-60'
        : 'text-juga-blue-40';

  const percentAbsolute = Math.abs(Number(currPrdyRate)).toFixed(2);

  const plusOrMinus =
    currPrdyVrssSign === '3' ? '' : currPrdyVrssSign < '3' ? '+' : '-';

  return (
    <div className='flex items-center justify-between w-full h-16 px-2'>
      <div className='flex flex-col font-semibold'>
        <div className='flex gap-2 text-sm'>
          <h2>{hts_kor_isnm}</h2>
          <p className='text-juga-grayscale-200'>{code}</p>
        </div>
        <div className='flex items-center gap-2'>
          <p className='text-lg'>{stringToLocaleString(currPrice)}원</p>
          <p>어제보다</p>
          <p className={`${colorStyleBySign}`}>
            {plusOrMinus}
            {Math.abs(Number(currPrdyVrss)).toLocaleString()}원 ({plusOrMinus}
            {percentAbsolute}%)
          </p>
        </div>
      </div>
      <div className='flex items-center gap-4 text-xs font-semibold'>
        {stockInfo.map((e, idx) => (
          <div key={`stockdetailinfo${idx}`} className='flex gap-2'>
            <p className='text-juga-grayscale-200'>{e.label}</p>
            <p>{e.value}</p>
          </div>
        ))}
        <button
          onClick={() => {
            if (!isLogin) {
              return;
            }
            setIsBookmarked((prev) => !prev);
          }}
        >
          {isLogin && isBookmarked ? (
            <HeartIcon className='size-6 fill-juga-red-60' />
          ) : (
            <HeartIcon className='size-6 fill-juga-grayscale-200' />
          )}
        </button>
      </div>
    </div>
  );
}
