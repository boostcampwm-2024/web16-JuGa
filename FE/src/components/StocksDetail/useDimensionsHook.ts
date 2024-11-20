import { RefObject, useCallback, useEffect, useState } from 'react';

type ChartDimensions = {
  width: number;
  height: number;
};

export const useDimensionsHook = (containerRef: RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 0,
    height: 0,
  });

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });
  }, []);

  useEffect(() => {
    updateDimensions();
  }, [updateDimensions, containerRef]);

  return dimensions;
};
