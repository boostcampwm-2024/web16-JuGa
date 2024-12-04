import { RefObject } from 'react';

export const setCanvasSize = (
  canvas: HTMLCanvasElement,
  widthConfig: number,
  heightConfig: number,
  containerRef: RefObject<HTMLDivElement>,
) => {
  if (!containerRef.current) return;

  canvas.width = containerRef.current.clientWidth * widthConfig * 2;
  canvas.height = containerRef.current.clientHeight * heightConfig * 2;
  canvas.style.width = `${containerRef.current.clientWidth * widthConfig}px`;
  canvas.style.height = `${containerRef.current.clientHeight * heightConfig}px`;
};
