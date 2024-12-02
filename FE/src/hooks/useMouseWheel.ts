import { useCallback, useEffect, useState, WheelEvent } from 'react';
import { StockChartUnit } from '../types.ts';

export const useMouseWheel = (data: StockChartUnit[] | undefined) => {
  const [dataRange, setDataRange] = useState({
    start: 0,
    end: 0,
  });
  const minDisplayData = 20;

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

  return { dataRange, handleWheel };
};
