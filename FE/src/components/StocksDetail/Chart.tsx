import {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEvent,
} from 'react';
import {
  ChartSizeConfigType,
  Padding,
  StockChartUnit,
  TiemCategory,
} from 'types';
import { useQuery } from '@tanstack/react-query';
import { getStocksChartDataByCode } from 'service/stocks';
import { drawLineChart } from 'utils/chart/drawLineChart.ts';
import { drawCandleChart } from 'utils/chart/drawCandleChart.ts';
import { drawBarChart } from 'utils/chart/drawBarChart.ts';
import { drawXAxis } from 'utils/chart/drawXAxis.ts';
import { drawUpperYAxis } from 'utils/chart/drawUpperYAxis.ts';
import { drawLowerYAxis } from 'utils/chart/drawLowerYAxis.ts';
import { drawChartGrid } from 'utils/chart/drawChartGrid.ts';
import { drawMouseGrid } from 'utils/chart/drawMouseGrid.ts';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';

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
  left: 40,
};

type StocksDeatailChartProps = {
  code: string;
};

export type MousePositionType = {
  x: number;
  y: number;
};

export default function Chart({ code }: StocksDeatailChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const upperChartCanvasRef = useRef<HTMLCanvasElement>(null);
  const lowerChartCanvasRef = useRef<HTMLCanvasElement>(null);
  const upperChartY = useRef<HTMLCanvasElement>(null);
  const lowerChartY = useRef<HTMLCanvasElement>(null);
  const chartX = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const [timeCategory, setTimeCategory] = useState<TiemCategory>('D');
  const [moveAverageToggle, setMoveAverageToggle] = useState(true);
  const [charSizeConfig, setChartSizeConfig] = useState<ChartSizeConfigType>({
    upperHeight: 0.5,
    lowerHeight: 0.4,
    chartWidth: 0.92,
    yAxisWidth: 0.08,
    xAxisHeight: 0.1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [upperLabelNum, setUpperLabelNum] = useState(3);
  const [lowerLabelNum, setLowerLabelNum] = useState(3);
  const [mousePosition, setMousePosition] = useState<MousePositionType>({
    x: 0,
    y: 0,
  });
  const [mouseIndex, setMouseIndex] = useState<number | null>(null);
  const [dataRange, setDataRange] = useState({
    start: 0,
    end: 0,
  });
  const minDisplayData = 20;

  const { data, isLoading } = useQuery(
    ['stocksChartData', code, timeCategory],
    () => getStocksChartDataByCode(code, timeCategory),
    { staleTime: 1000 },
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const minHeight = 0.2;
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseY = e.clientY - containerRect.top;
      const ratio = mouseY / containerRef.current.clientHeight;
      const maxHeight = 0.9 - minHeight;
      const upperRatio = Math.min(maxHeight, Math.max(minHeight, ratio));
      const lowerRatio = 0.9 - upperRatio;

      const calculateLabelNum = (ratio: number) => {
        if (ratio <= 0.2) return 1;
        if (ratio <= 0.35) return 2;
        if (ratio <= 0.55) return 3;
        return 4;
      };

      if (lowerRatio >= minHeight && upperRatio >= minHeight) {
        setChartSizeConfig((prev) => ({
          ...prev,
          upperHeight: upperRatio,
          lowerHeight: lowerRatio,
        }));

        setUpperLabelNum(calculateLabelNum(upperRatio));
        setLowerLabelNum(calculateLabelNum(lowerRatio));
      }
    },
    [
      isDragging,
      containerRef,
      setChartSizeConfig,
      setUpperLabelNum,
      setLowerLabelNum,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getCanvasMousePosition = (e: MouseEvent) => {
    if (!containerRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setMousePosition({
        x: (e.clientX - rect.left) * 2,
        y: (e.clientY - rect.top) * 2,
      });
    });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isDragging, handleMouseDown, handleMouseUp, handleMouseMove]);
  const setCanvasSize = useCallback(
    (canvas: HTMLCanvasElement, widthConfig: number, heightConfig: number) => {
      if (!containerRef.current) return;

      canvas.width = containerRef.current.clientWidth * widthConfig * 2;
      canvas.height = containerRef.current.clientHeight * heightConfig * 2;
      canvas.style.width = `${containerRef.current.clientWidth * widthConfig}px`;
      canvas.style.height = `${containerRef.current.clientHeight * heightConfig}px`;
    },
    [containerRef],
  );

  const renderChart = useCallback(
    (
      upperChartCanvas: HTMLCanvasElement,
      lowerChartCanvas: HTMLCanvasElement,
      upperChartYCanvas: HTMLCanvasElement,
      lowerChartYCanvas: HTMLCanvasElement,
      chartXCanvas: HTMLCanvasElement,
      chartData: StockChartUnit[],
      mousePosition: MousePositionType,
    ) => {
      const UpperChartCtx = upperChartCanvas.getContext('2d');
      const LowerChartCtx = lowerChartCanvas.getContext('2d');
      const UpperYCtx = upperChartYCanvas.getContext('2d');
      const LowerYCtx = lowerChartYCanvas.getContext('2d');
      const ChartXCtx = chartXCanvas.getContext('2d');
      const displayData = chartData.slice(dataRange.start, dataRange.end + 1);
      if (
        !UpperChartCtx ||
        !LowerChartCtx ||
        !UpperYCtx ||
        !LowerYCtx ||
        !ChartXCtx
      )
        return;

      drawChartGrid(
        UpperChartCtx,
        upperChartCanvas.width - padding.left - padding.right,
        upperChartCanvas.height - padding.top - padding.bottom,
        upperLabelNum,
        LowerChartCtx,
        lowerChartCanvas.width - padding.left - padding.right,
        lowerChartCanvas.height - padding.top - padding.bottom,
        lowerLabelNum,
        displayData,
        padding,
      );

      if (moveAverageToggle) {
        drawLineChart(
          UpperChartCtx,
          displayData,
          0,
          0,
          upperChartCanvas.width - padding.left - padding.right,
          upperChartCanvas.height - padding.top - padding.bottom,
          padding,
          0.1,
        );
      }

      drawCandleChart(
        UpperChartCtx,
        displayData,
        0,
        0,
        upperChartCanvas.width - padding.left - padding.right,
        upperChartCanvas.height - padding.top - padding.bottom,
        padding,
        0.1,
      );

      drawBarChart(
        LowerChartCtx,
        displayData,
        lowerChartCanvas.width - padding.left - padding.right,
        lowerChartCanvas.height - padding.top - padding.bottom,
        padding,
      );

      drawUpperYAxis(
        UpperYCtx,
        displayData,
        upperChartYCanvas.width - padding.left - padding.right,
        upperChartYCanvas.height - padding.top - padding.bottom,
        upperLabelNum,
        padding,
        0.1,
        mousePosition,
        upperChartCanvas.width,
        upperChartCanvas.height,
      );

      drawLowerYAxis(
        LowerYCtx,
        displayData,
        lowerChartYCanvas.width - padding.left - padding.right,
        lowerChartYCanvas.height - padding.top - padding.bottom,
        lowerLabelNum,
        padding,
        mousePosition,
        lowerChartCanvas.width,
        lowerChartCanvas.height,
        upperChartCanvas.height,
      );

      drawXAxis(
        ChartXCtx,
        displayData,
        chartXCanvas.width - padding.left - padding.right,
        chartXCanvas.height,
        padding,
        mousePosition,
        upperChartCanvas.height + lowerChartCanvas.height,
        setMouseIndex,
      );

      if (
        mousePosition.x > padding.left &&
        mousePosition.x < upperChartCanvas.width &&
        mousePosition.y > padding.top &&
        mousePosition.y < upperChartCanvas.height + lowerChartCanvas.height
      ) {
        drawMouseGrid(
          UpperChartCtx,
          upperChartCanvas.width - padding.left - padding.right,
          upperChartCanvas.height - padding.top - padding.bottom,
          LowerChartCtx,
          lowerChartCanvas.width - padding.left - padding.right,
          lowerChartCanvas.height - padding.top - padding.bottom,
          padding,
          mousePosition,
        );
      }
    },
    [
      padding,
      upperLabelNum,
      lowerLabelNum,
      drawChartGrid,
      drawLineChart,
      drawCandleChart,
      drawBarChart,
      drawUpperYAxis,
      drawLowerYAxis,
      drawXAxis,
      moveAverageToggle,
      dataRange,
    ],
  );
  const handleWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (!data) return;

      const wheelPower = 0.1;
      const curRange = dataRange.end - dataRange.start;

      // 축소
      if (e.deltaY > 0) {
        // 늘어나야함 & 데이터 최대 갯수보다 작아야함.
        const newRange = Math.min(curRange * (1 + wheelPower), data.length);
        const newStart = Math.max(data.length - newRange, 0);

        setDataRange({
          start: newStart,
          end: data.length - 1,
        });
      }

      // 확대
      if (e.deltaY < 0) {
        // 줄어야함 & 최소 데이터 갯수보단 커야함.
        const newRange = Math.max(curRange * (1 - wheelPower), minDisplayData);
        const newStart = Math.max(data.length - newRange, 0);

        setDataRange({
          start: newStart,
          end: data.length - 1,
        });
      }
    },
    [data, dataRange],
  );

  useEffect(() => {
    if (data) {
      setDataRange((prev) => ({
        ...prev,
        start: 0,
        end: data.length - 1,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (isLoading || !data) return;

    if (
      !upperChartCanvasRef.current ||
      !lowerChartCanvasRef.current ||
      !upperChartY.current ||
      !lowerChartY.current ||
      !chartX.current
    )
      return;
    setCanvasSize(
      upperChartCanvasRef.current,
      charSizeConfig.chartWidth,
      charSizeConfig.upperHeight,
    );

    setCanvasSize(
      upperChartY.current,
      charSizeConfig.yAxisWidth,
      charSizeConfig.upperHeight,
    );

    setCanvasSize(
      lowerChartCanvasRef.current,
      charSizeConfig.chartWidth,
      charSizeConfig.lowerHeight,
    );

    setCanvasSize(
      lowerChartY.current,
      charSizeConfig.yAxisWidth,
      charSizeConfig.lowerHeight,
    );

    setCanvasSize(
      chartX.current,
      charSizeConfig.chartWidth,
      charSizeConfig.xAxisHeight,
    );

    renderChart(
      upperChartCanvasRef.current,
      lowerChartCanvasRef.current,
      upperChartY.current,
      lowerChartY.current,
      chartX.current,
      data,
      mousePosition,
    );
  }, [
    timeCategory,
    data,
    isLoading,
    setCanvasSize,
    renderChart,
    charSizeConfig,
    mousePosition,
  ]);
  return (
    <div className='box-border flex h-[260px] flex-col items-center rounded-lg bg-white p-3'>
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
      <div
        ref={containerRef}
        className='mt-2 flex h-[200px] w-full flex-col'
        onMouseMove={getCanvasMousePosition}
        onWheel={handleWheel}
      >
        {/* Upper 차트 영역 */}
        <div className='flex flex-row'>
          <canvas ref={upperChartCanvasRef} />
          <canvas ref={upperChartY} />
          <div className='absolute flex w-[520px] flex-col gap-1'>
            {mouseIndex !== null && data ? (
              <div
                className={'relative flex flex-row items-center gap-1 text-xs'}
              >
                <span>
                  시작 {Number(data[mouseIndex].stck_oprc).toLocaleString()}원
                </span>
                <span>
                  고가 {Number(data[mouseIndex].stck_hgpr).toLocaleString()}원
                </span>
                <span>
                  저가 {Number(data[mouseIndex].stck_lwpr).toLocaleString()}원
                </span>
                <span>
                  종가 {Number(data[mouseIndex].stck_clpr).toLocaleString()}원
                </span>
              </div>
            ) : null}
            <div className={'relative flex flex-row items-center gap-1'}>
              <button
                className='flex h-3 w-3 items-center justify-center rounded bg-juga-grayscale-50'
                onClick={() => setMoveAverageToggle((prev) => !prev)}
              >
                {moveAverageToggle ? (
                  <EyeSlashIcon className='h-2 w-2 text-juga-grayscale-200' />
                ) : (
                  <EyeIcon className='h-2 w-2 text-juga-grayscale-200' />
                )}
              </button>
              <div className='text-xs text-black'>이동평균선</div>
              <div className='flex gap-1'>
                {mouseIndex !== null ? (
                  data && !isNaN(Number(data[mouseIndex].mov_avg_5)) ? (
                    <>
                      <span className='text-xs text-orange-500'>5</span>
                      <span className='text-xs'>
                        {Math.floor(
                          Number(data[mouseIndex].mov_avg_5),
                        ).toLocaleString()}
                        원
                      </span>
                    </>
                  ) : null
                ) : (
                  <span className='text-xs text-orange-500'>5</span>
                )}

                {mouseIndex !== null ? (
                  data && !isNaN(Number(data[mouseIndex].mov_avg_20)) ? (
                    <>
                      <span className='text-xs text-green-600'>20</span>
                      <span className={'text-xs'}>
                        {Math.floor(
                          Number(data[mouseIndex].mov_avg_20),
                        ).toLocaleString()}
                        원
                      </span>
                    </>
                  ) : null
                ) : (
                  <span className='text-xs text-green-600'>20</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='group flex h-[1px] w-full cursor-row-resize items-center justify-center bg-juga-grayscale-100'>
          <div
            className='z-[6] h-2 w-full hover:bg-juga-grayscale-100/50'
            onMouseDown={handleMouseDown}
          ></div>
        </div>
        {/* Lower 차트 영역 */}
        <div className='flex flex-row'>
          <canvas ref={lowerChartCanvasRef} />
          <canvas ref={lowerChartY} />
        </div>
        {/* X축 영역 */}
        <div className='flex flex-row'>
          <canvas ref={chartX} />
        </div>
      </div>
    </div>
  );
}
