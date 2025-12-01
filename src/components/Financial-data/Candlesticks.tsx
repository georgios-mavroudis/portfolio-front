import type { StockData } from '@/queries/stock-data/model';
import { useMemo, type FC } from 'react';
import { useGraphColors } from '@/design-system/hooks';
import { usePlot } from '@/visualizations/graph-hooks';
import { useThemeBreakpointValue, type BreakpointKey } from '@/design-system/tokens/breakpoints';

type Props = {
  data: StockData[];
};

const BREAKPOINTS_TO_CANDLESTICK_MAPPING: Record<
  BreakpointKey,
  { base: number; extremity: number }
> = {
  base: { base: 4, extremity: 1 },
  sm: { base: 6, extremity: 1 },
  md: { base: 10, extremity: 2 },
  lg: { base: 12, extremity: 2 },
  xl: { base: 20, extremity: 2 },
  '2xl': { base: 20, extremity: 2 },
};
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
  const currentBreakpoint = useThemeBreakpointValue();
  const barWidth = useMemo(() => {
    return BREAKPOINTS_TO_CANDLESTICK_MAPPING[currentBreakpoint].base * transform.k;
  }, [currentBreakpoint, transform.k]);
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
              strokeWidth={BREAKPOINTS_TO_CANDLESTICK_MAPPING[currentBreakpoint].extremity}
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
              strokeWidth={BREAKPOINTS_TO_CANDLESTICK_MAPPING[currentBreakpoint].extremity}
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
