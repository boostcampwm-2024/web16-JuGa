import { StockChartUnit } from '../../types.ts';

export const makeChartDataFlat = (data: StockChartUnit[]) => {
  return data
    .map((d) => {
      if (d.mov_avg_20 && d.mov_avg_5) {
        return [
          +d.stck_hgpr,
          +d.stck_lwpr,
          +d.stck_clpr,
          +d.stck_oprc,
          Math.floor(+d.mov_avg_5),
          Math.floor(+d.mov_avg_20),
        ];
      } else if (d.mov_avg_5) {
        return [
          +d.stck_hgpr,
          +d.stck_lwpr,
          +d.stck_clpr,
          +d.stck_oprc,
          Math.floor(+d.mov_avg_5),
        ];
      } else if (d.mov_avg_20) {
        return [
          +d.stck_hgpr,
          +d.stck_lwpr,
          +d.stck_clpr,
          +d.stck_oprc,
          Math.floor(+d.mov_avg_20),
        ];
      } else {
        return [+d.stck_hgpr, +d.stck_lwpr, +d.stck_clpr, +d.stck_oprc];
      }
    })
    .flat();
};
