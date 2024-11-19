import { useEffect, useRef, useState } from 'react';
import { Padding, TiemCategory } from 'types';
import { useQuery } from '@tanstack/react-query';
import { getStocksChartDataByCode } from 'service/stocks';
import { drawLineChart } from '../../utils/chart/drawLineChart.ts';
import { drawCandleChart } from '../../utils/chart/drawCandleChart.ts';
import { drawBarChart } from '../../utils/chart/drawBarChart.ts';
import { drawXAxis } from '../../utils/chart/drawXAxis.ts';
import { drawUpperYAxis } from '../../utils/chart/drawUpperYAxis.ts';
import { drawLowerYAxis } from '../../utils/chart/drawLowerYAxis.ts';

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
    if (isLoading || !data) return;

    const parent = containerRef.current;
    const upperChartCanvas = upperChartCanvasRef.current;
    const lowerChartCanvas = lowerChartCanvasRef.current;
    const upperChartYCanvas = upperChartY.current;
    const lowerChartYCanvas = lowerChartY.current;
    const chartXCanvas = chartX.current;

    if (
      !parent ||
      !upperChartCanvas ||
      !lowerChartCanvas ||
      !upperChartYCanvas ||
      !lowerChartYCanvas ||
      !chartXCanvas
    )
      return;

    const displayWidth = parent.clientWidth;
    const displayHeight = parent.clientHeight;

    const upperHeight = displayHeight * 0.5;
    const lowerHeight = displayHeight * 0.4;
    const chartWidth = displayWidth * 0.92;
    const yAxisWidth = displayWidth * 0.08;

    // 차트 영역 설정
    upperChartCanvas.width = chartWidth * 2;
    upperChartCanvas.height = upperHeight * 2;
    upperChartCanvas.style.width = `${chartWidth}px`;
    upperChartCanvas.style.height = `${upperHeight}px`;

    upperChartYCanvas.width = yAxisWidth * 2;
    upperChartYCanvas.height = upperHeight * 2;
    upperChartYCanvas.style.width = `${yAxisWidth}px`;
    upperChartYCanvas.style.height = `${upperHeight}px`;

    lowerChartCanvas.width = chartWidth * 2;
    lowerChartCanvas.height = lowerHeight * 2;
    lowerChartCanvas.style.width = `${chartWidth}px`;
    lowerChartCanvas.style.height = `${lowerHeight}px`;

    lowerChartYCanvas.width = yAxisWidth * 2;
    lowerChartYCanvas.height = lowerHeight * 2;
    lowerChartYCanvas.style.width = `${yAxisWidth}px`;
    lowerChartYCanvas.style.height = `${lowerHeight}px`;

    chartXCanvas.width = chartWidth * 2;
    chartXCanvas.height = displayHeight * 0.1 * 2;
    chartXCanvas.style.width = `${chartWidth}px`;
    chartXCanvas.style.height = `${displayHeight * 0.1}px`;

    const UpperChartCtx = upperChartCanvas.getContext('2d');
    const LowerChartCtx = lowerChartCanvas.getContext('2d');
    const UpperYCtx = upperChartYCanvas.getContext('2d');
    const LowerYCtx = lowerChartYCanvas.getContext('2d');
    const ChartXCtx = chartXCanvas.getContext('2d');

    if (
      !UpperChartCtx ||
      !LowerChartCtx ||
      !UpperYCtx ||
      !LowerYCtx ||
      !ChartXCtx
    )
      return;

    const padding: Padding = {
      top: 20,
      right: 80,
      bottom: 10,
      left: 20,
    };

    const upperChartWidth =
      upperChartCanvas.width - padding.left - padding.right;
    const upperChartHeight =
      upperChartCanvas.height - padding.top - padding.bottom;
    const lowerChartWidth =
      lowerChartCanvas.width - padding.left - padding.right;
    const lowerChartHeight = lowerChartCanvas.height;

    drawLineChart(
      UpperChartCtx,
      data,
      0,
      0,
      upperChartWidth,
      upperChartHeight,
      padding,
      0.1,
    );

    drawCandleChart(
      UpperChartCtx,
      data,
      0,
      0,
      upperChartWidth,
      upperChartHeight,
      padding,
      0.1,
    );

    // Lower 차트 그리기
    drawBarChart(
      LowerChartCtx,
      data,
      lowerChartWidth,
      lowerChartHeight - padding.top - padding.bottom,
      padding,
    );

    drawUpperYAxis(
      UpperYCtx,
      data,
      upperChartYCanvas.width - padding.left - padding.right,
      upperChartYCanvas.height - padding.top - padding.bottom,
      padding,
      0.1,
    );

    drawLowerYAxis(
      LowerYCtx,
      data,
      lowerChartYCanvas.width - padding.left - padding.right,
      lowerChartYCanvas.height - padding.top - padding.bottom,
      padding,
    );

    drawXAxis(
      ChartXCtx,
      data,
      lowerChartWidth,
      upperChartCanvas.height / 5,
      padding,
    );
  }, [timeCategory, data, isLoading]);

  return (
    <div className='box-border flex h-[260px] flex-col items-center rounded-lg bg-juga-grayscale-50 p-3'>
      <div className='flex h-fit w-full items-center justify-between'>
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
      <div ref={containerRef} className='mt-2 flex h-[208px] w-full flex-col'>
        {/* Upper 차트 영역 */}
        <div className='flex h-[50%] flex-row items-center'>
          <canvas ref={upperChartCanvasRef} className='' />
          <canvas ref={upperChartY} className='' />
        </div>
        {/* Lower 차트 영역 */}
        <div className='flex h-[40%] flex-row'>
          <canvas ref={lowerChartCanvasRef} className='' />
          <canvas ref={lowerChartY} className='' />
        </div>
        {/* X축 영역 */}
        <div className='flex h-[10%] flex-row'>
          <canvas ref={chartX} className='' />
        </div>
      </div>
    </div>
  );
}
