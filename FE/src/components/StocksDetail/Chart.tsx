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
import { useDimensionsHook } from './useDimensionsHook.ts';

const categories: { label: string; value: TiemCategory }[] = [
  { label: '일', value: 'D' },
  { label: '주', value: 'W' },
  { label: '월', value: 'M' },
  { label: '년', value: 'Y' },
];

const padding: Padding = {
  top: 20,
  right: 80,
  bottom: 10,
  left: 20,
};

const CHART_SIZE_CONFIG = {
  upperHeight: 0.5,
  lowerHeight: 0.4,
  chartWidth: 0.92,
  yAxisWidth: 0.08,
  xAxisHeight: 0.1,
};

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

  const dimension = useDimensionsHook(containerRef);

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

    upperChartCanvas.width = dimension.width * CHART_SIZE_CONFIG.chartWidth * 2;
    upperChartCanvas.height =
      dimension.height * CHART_SIZE_CONFIG.upperHeight * 2;
    upperChartCanvas.style.width = `${dimension.width * CHART_SIZE_CONFIG.chartWidth}px`;
    upperChartCanvas.style.height = `${dimension.height * CHART_SIZE_CONFIG.upperHeight}px`;

    upperChartYCanvas.width =
      dimension.width * CHART_SIZE_CONFIG.yAxisWidth * 2;
    upperChartYCanvas.height =
      dimension.height * CHART_SIZE_CONFIG.upperHeight * 2;
    upperChartYCanvas.style.width = `${dimension.width * CHART_SIZE_CONFIG.yAxisWidth}px`;
    upperChartYCanvas.style.height = `${dimension.height * CHART_SIZE_CONFIG.upperHeight}px`;

    lowerChartCanvas.width = dimension.width * CHART_SIZE_CONFIG.chartWidth * 2;
    lowerChartCanvas.height =
      dimension.height * CHART_SIZE_CONFIG.lowerHeight * 2;
    lowerChartCanvas.style.width = `${dimension.width * CHART_SIZE_CONFIG.chartWidth}px`;
    lowerChartCanvas.style.height = `${dimension.height * CHART_SIZE_CONFIG.lowerHeight}px`;

    lowerChartYCanvas.width =
      dimension.width * CHART_SIZE_CONFIG.yAxisWidth * 2;
    lowerChartYCanvas.height =
      dimension.height * CHART_SIZE_CONFIG.lowerHeight * 2;
    lowerChartYCanvas.style.width = `${dimension.width * CHART_SIZE_CONFIG.yAxisWidth}px`;
    lowerChartYCanvas.style.height = `${dimension.height * CHART_SIZE_CONFIG.lowerHeight}px`;

    chartXCanvas.width = dimension.width * CHART_SIZE_CONFIG.chartWidth * 2;
    chartXCanvas.height = dimension.height * CHART_SIZE_CONFIG.xAxisHeight * 2;
    chartXCanvas.style.width = `${dimension.width * CHART_SIZE_CONFIG.chartWidth}px`;
    chartXCanvas.style.height = `${dimension.height * CHART_SIZE_CONFIG.xAxisHeight}px`;

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

    drawLineChart(
      UpperChartCtx,
      data,
      0,
      0,
      upperChartCanvas.width - padding.left - padding.right,
      upperChartCanvas.height - padding.top - padding.bottom,
      padding,
      0.1,
    );

    drawCandleChart(
      UpperChartCtx,
      data,
      0,
      0,
      upperChartCanvas.width - padding.left - padding.right,
      upperChartCanvas.height - padding.top - padding.bottom,
      padding,
      0.1,
    );

    // Lower 차트 그리기
    drawBarChart(
      LowerChartCtx,
      data,
      lowerChartCanvas.width - padding.left - padding.right,
      lowerChartCanvas.height - padding.top - padding.bottom,
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
      chartXCanvas.width - padding.left - padding.right,
      chartXCanvas.height,
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
        <div className='flex flex-row items-center'>
          <canvas ref={upperChartCanvasRef} className='' />
          <canvas ref={upperChartY} className='' />
        </div>
        {/* Lower 차트 영역 */}
        <div className='flex flex-row'>
          <canvas ref={lowerChartCanvasRef} className='' />
          <canvas ref={lowerChartY} className='' />
        </div>
        {/* X축 영역 */}
        <div className='flex flex-row'>
          <canvas ref={chartX} className='' />
        </div>
      </div>
    </div>
  );
}
