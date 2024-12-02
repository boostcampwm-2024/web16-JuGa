import { RefObject, useCallback, useEffect, useState } from 'react';
import { ChartSizeConfigType } from '../components/StocksDetail/type.ts';

export const useMouseUpDown = (containerRef: RefObject<HTMLDivElement>) => {
  const [chartSizeConfig, setChartSizeConfig] = useState<ChartSizeConfigType>({
    upperHeight: 0.5,
    lowerHeight: 0.4,
    chartWidth: 0.92,
    yAxisWidth: 0.08,
    xAxisHeight: 0.1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [upperLabelNum, setUpperLabelNum] = useState(3);
  const [lowerLabelNum, setLowerLabelNum] = useState(3);

  const handleMouseDown = useCallback(() => {
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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseDown, handleMouseUp, handleMouseMove]);

  return {
    chartSizeConfig,
    upperLabelNum,
    lowerLabelNum,
    handleMouseDown,
  };
};
