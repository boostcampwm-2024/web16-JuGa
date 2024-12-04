import { useRef } from 'react';

export const useCanvasRef = () => {
  const upperChartCanvasRef = useRef<HTMLCanvasElement>(null);
  const lowerChartCanvasRef = useRef<HTMLCanvasElement>(null);
  const upperChartY = useRef<HTMLCanvasElement>(null);
  const lowerChartY = useRef<HTMLCanvasElement>(null);
  const chartX = useRef<HTMLCanvasElement>(null);

  return {
    upperChartCanvasRef,
    lowerChartCanvasRef,
    upperChartY,
    lowerChartY,
    chartX,
  };
};
