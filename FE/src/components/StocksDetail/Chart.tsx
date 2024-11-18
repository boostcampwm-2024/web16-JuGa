import { useEffect, useRef, useState } from 'react';
import { TiemCategory } from 'types';
import { drawBarChart, drawCandleChart, drawLineChart } from 'utils/chart';
import { useQuery } from '@tanstack/react-query';
import { getStocksChartDataByCode } from 'service/stocks';

const categories: { label: string; value: TiemCategory }[] = [
  { label: '일', value: 'D' },
  { label: '주', value: 'W' },
  { label: '월', value: 'M' },
  { label: '년', value: 'Y' },
];

type StocksDeatailChartProps = {
  code: string;
};

export default function Chart({ code }: StocksDeatailChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const upperChartCanvasRef = useRef<HTMLCanvasElement>(null);
  const lowerChartCanvasRef = useRef<HTMLCanvasElement>(null);
  const upperChartY = useRef<HTMLCanvasElement>(null);
  const lowerChartY = useRef<HTMLCanvasElement>(null);
  const chartX = useRef<HTMLCanvasElement>(null);

  const [timeCategory, setTimeCategory] = useState<TiemCategory>('D');

  const { data, isLoading } = useQuery(
    ['stocksChartData', code, timeCategory],
    () => getStocksChartDataByCode(code, timeCategory),
  );

  useEffect(() => {
    if (isLoading) return;
    if (!data) return;

    const parent = containerRef.current;
    const upperChartCanvas = upperChartCanvasRef.current;
    const lowerChartCanvas = lowerChartCanvasRef.current;
    const upperChartYCanvas = upperChartY.current;
    const lowerChartYCanvas = lowerChartY.current;

    if (!upperChartCanvas || !parent || !lowerChartCanvas) return;

    const displayWidth = parent.clientWidth;
    const displayHeight = parent.clientHeight;

    // 해상도 높이기
    upperChartCanvas.width = displayWidth * 2;
    upperChartCanvas.height = displayHeight * 2;

    upperChartCanvas.style.width = `${displayWidth}px`;
    upperChartCanvas.style.height = `${displayHeight * 0.5}px`;

    lowerChartCanvas.width = displayWidth * 2;
    lowerChartCanvas.height = displayHeight * 2;

    lowerChartCanvas.style.width = `${displayWidth}px`;
    lowerChartCanvas.style.height = `${displayHeight * 0.3}px`;

    console.log(`${displayHeight * 0.8}px`);

    const UpperChartCtx = upperChartCanvas.getContext('2d');
    const LowerChartCtx = lowerChartCanvas.getContext('2d');

    if (!UpperChartCtx || !LowerChartCtx) return;

    // UpperChartCtx.fillRect(
    //   0,
    //   0,
    //   upperChartCanvas.width,
    //   upperChartCanvas.height,
    // );

    const padding = {
      top: 20,
      right: 160,
      bottom: 10,
      left: 20,
    };

    const chartWidth = upperChartCanvas.width - padding.left - padding.right;
    const chartHeight = upperChartCanvas.height - padding.top - padding.bottom;

    const arr = data.map((e) => +e.stck_oprc);

    drawLineChart(
      UpperChartCtx,
      arr,
      0,
      0,
      chartWidth,
      chartHeight,
      padding,
      0.1,
    );
    drawBarChart(
      LowerChartCtx,
      data,
      0,
      0, // chartHeight를 0으로 수정
      lowerChartCanvas.width - padding.left - padding.right,
      lowerChartCanvas.height - padding.top - padding.bottom,
      padding,
    );
    drawCandleChart(
      UpperChartCtx,
      data,
      0,
      0,
      chartWidth,
      chartHeight,
      padding,
      0.1,
    );
  }, [timeCategory, data, isLoading]);

  return (
    <div className='flex h-[260px] flex-1 flex-col items-center rounded-lg bg-juga-grayscale-50 p-3'>
      <div className='flex w-full items-center justify-between'>
        <p className='font-semibold'>차트</p>
        <nav className='flex gap-4 text-sm'>
          {categories.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTimeCategory(value)}
              className={`${timeCategory === value ? 'bg-gray-200' : ''} h-7 w-7 rounded-lg p-1 transition hover:bg-juga-grayscale-100`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div ref={containerRef} className={'mt-2 flex h-full w-full flex-col'}>
        <div className={'flex h-full w-full flex-row items-center'}>
          <canvas ref={upperChartCanvasRef} className='' />
          <canvas ref={upperChartY} className={'w-[56px]'} />
        </div>
        {/*<div>*/}
        {/*  <button> 실선</button>*/}
        {/*</div>*/}
        <div className={'flex w-full flex-row'}>
          <canvas ref={lowerChartCanvasRef} className='' />
          <canvas ref={lowerChartY} className={'w-[56px]'} />
        </div>
        <div className={'flex h-[32px] flex-row'}>
          <canvas ref={chartX} />
        </div>
      </div>
    </div>
  );
}
