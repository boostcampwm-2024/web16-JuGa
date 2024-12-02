import { MouseEvent, RefObject, useRef, useState } from 'react';
import { MousePositionType } from '../types.ts';

export const useMouseMove = (containerRef: RefObject<HTMLDivElement>) => {
  const rafRef = useRef<number>();
  const [mousePosition, setMousePosition] = useState<MousePositionType>({
    x: 0,
    y: 0,
  });

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
  return { mousePosition, getCanvasMousePosition };
};
