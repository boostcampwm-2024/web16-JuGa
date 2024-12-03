import { useEffect, useRef, useState } from 'react';
import { TiemCategory } from 'types';
import { useQuery } from '@tanstack/react-query';
import { getStocksChartDataByCode } from 'service/stocks';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { setCanvasSize } from 'utils/chart/setCanvasSize.ts';
import { useMouseMove } from 'hooks/useMouseMove.ts';
import { useMouseUpDown } from 'hooks/useMouseUpDown.ts';
import { useMouseWheel } from 'hooks/useMouseWheel.ts';
import { categories } from 'constants.ts';
import { useCanvasRef } from 'hooks/useCanvasRef.ts';
import { useCanvasResize } from 'hooks/useCanvasResize.ts';
import { renderChart } from 'utils/renderChart.ts';

type StocksDetailChartProps = {
  code: string;
};

export default function Chart({ code }: StocksDetailChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    upperChartCanvasRef,
    lowerChartCanvasRef,
    upperChartY,
    lowerChartY,
    chartX,
  } = useCanvasRef();
  const [timeCategory, setTimeCategory] = useState<TiemCategory>('D');
  const [moveAverageToggle, setMoveAverageToggle] = useState(true);

  const [mouseIndex, setMouseIndex] = useState<number | null>(null);

  const { data } = useQuery(
    ['stocksChartData', code, timeCategory],
    () => getStocksChartDataByCode(code, timeCategory),
    { staleTime: 1000 * 60, suspense: true, keepPreviousData: true },
  );

  const { mousePosition, getCanvasMousePosition } = useMouseMove(containerRef);
  const { chartSizeConfig, upperLabelNum, lowerLabelNum, handleMouseDown } =
    useMouseUpDown(containerRef);
  const { dataRange, handleWheel } = useMouseWheel(data);
  const { resizeCanvases } = useCanvasResize(
    {
      upperChartCanvasRef,
      lowerChartCanvasRef,
      upperChartY,
      lowerChartY,
      chartX,
    },
    chartSizeConfig,
    containerRef,
  );

  useEffect(() => {
    if (!data) return;

    if (
      !upperChartCanvasRef.current ||
      !lowerChartCanvasRef.current ||
      !upperChartY.current ||
      !lowerChartY.current ||
      !chartX.current
    )
      return;

    resizeCanvases();

    renderChart(
      upperChartCanvasRef.current,
      lowerChartCanvasRef.current,
      upperChartY.current,
      lowerChartY.current,
      chartX.current,
      data,
      mousePosition,
      dataRange,
      upperLabelNum,
      lowerLabelNum,
      moveAverageToggle,
      setMouseIndex,
    );
  }, [
    timeCategory,
    data,
    setCanvasSize,
    renderChart,
    chartSizeConfig,
    mousePosition,
    dataRange,
    upperLabelNum,
    lowerLabelNum,
    moveAverageToggle,
    setMouseIndex,
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
