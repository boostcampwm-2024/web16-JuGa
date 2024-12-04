import { RefObject, useCallback } from 'react';
import { ChartSizeConfigType } from 'components/StocksDetail/type.ts';
import { setCanvasSize } from 'utils/chart/setCanvasSize.ts';

type CanvasRefType = {
  upperChartCanvasRef: RefObject<HTMLCanvasElement>;
  upperChartY: RefObject<HTMLCanvasElement>;
  lowerChartCanvasRef: RefObject<HTMLCanvasElement>;
  lowerChartY: RefObject<HTMLCanvasElement>;
  chartX: RefObject<HTMLCanvasElement>;
};

export const useCanvasResize = (
  canvasRefs: CanvasRefType,
  chartSizeConfig: ChartSizeConfigType,
  containerRef: RefObject<HTMLDivElement>,
) => {
  const resizeCanvases = useCallback(() => {
    if (!containerRef.current) return;

    const configs = [
      {
        ref: canvasRefs.upperChartCanvasRef,
        width: chartSizeConfig.chartWidth,
        height: chartSizeConfig.upperHeight,
      },
      {
        ref: canvasRefs.upperChartY,
        width: chartSizeConfig.yAxisWidth,
        height: chartSizeConfig.upperHeight,
      },
      {
        ref: canvasRefs.lowerChartCanvasRef,
        width: chartSizeConfig.chartWidth,
        height: chartSizeConfig.lowerHeight,
      },
      {
        ref: canvasRefs.lowerChartY,
        width: chartSizeConfig.yAxisWidth,
        height: chartSizeConfig.lowerHeight,
      },
      {
        ref: canvasRefs.chartX,
        width: chartSizeConfig.chartWidth,
        height: chartSizeConfig.xAxisHeight,
      },
    ];

    configs.forEach(({ ref, width, height }) => {
      if (ref.current) {
        setCanvasSize(ref.current, width, height, containerRef);
      }
    });
  }, [chartSizeConfig, containerRef]);

  return { resizeCanvases };
};
