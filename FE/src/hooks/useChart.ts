import { useRef } from 'react';

export const useChart = () => {
  const upperChartCanvasRef = useRef<HTMLCanvasElement>(null);

  // const upperChartY = useRef<HTMLCanvasElement>(null);

  return {
    upperChartCanvasRef,
  };
};
