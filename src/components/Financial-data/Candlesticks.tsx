import type { StockData } from '@/queries/stock-data/model';
import { type FC } from 'react';
import { useGraphColors } from '@/design-system/hooks';
import { usePlot } from '@/visualizations/graph-hooks';

type Props = {
  data: StockData[];
};
const MINIMUM_WIDTH_FACTOR = 20;

export const Candlesticks: FC<Props> = ({ data }) => {
  const {
    dateScale,
    yScale,
    transform,
    dimensions: { height },
  } = usePlot();
  const {
    stockData: { win, loss, barBorderWin, barBorderLoss },
  } = useGraphColors();
  const barWidth = MINIMUM_WIDTH_FACTOR * transform.k;
  return (
    <>
      {data.map((datum, i) => {
        const { change, open, close, high, low, date } = datum;
        const [topRectPoint, bottomRectPoint] = change < 0 ? [close, open] : [open, close];
        const color = change >= 0 ? win : loss;
        const borderColor = change >= 0 ? barBorderWin : barBorderLoss;
        return (
          <g key={i}>
            <line
              stroke={color}
              strokeWidth={2}
              y1={height - yScale(high)}
              y2={height - yScale(topRectPoint)}
              x1={dateScale(date) + barWidth / 2}
              x2={dateScale(date) + barWidth / 2}
            />
            <rect
              fill={color}
              stroke={borderColor}
              strokeWidth={0.3}
              y={height - yScale(bottomRectPoint)}
              height={yScale(bottomRectPoint) - yScale(topRectPoint)}
              x={dateScale(date)}
              width={barWidth}
            />
            <line
              stroke={color}
              strokeWidth={2}
              y2={height - yScale(bottomRectPoint)}
              y1={height - yScale(low)}
              x1={dateScale(date) + barWidth / 2}
              x2={dateScale(date) + barWidth / 2}
            />
          </g>
        );
      })}
    </>
  );
};
