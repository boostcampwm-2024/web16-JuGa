import { Padding, TiemCategory } from './types.ts';

export const stockIndexMap: Record<string, string> = {
  전체: 'ALL',
  코스피: 'KOSPI',
  코스닥: 'KOSDAQ',
  코스피200: 'KOSPI200',
  코스닥150: 'KSQ150',
};

export const categories: { label: string; value: TiemCategory }[] = [
  { label: '일', value: 'D' },
  { label: '주', value: 'W' },
  { label: '월', value: 'M' },
  { label: '년', value: 'Y' },
];

export const padding: Padding = {
  top: 20,
  right: 80,
  bottom: 10,
  left: 40,
};
