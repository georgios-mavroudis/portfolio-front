import { type FC, useCallback, useMemo } from 'react';
import { startOfMonth } from 'date-fns';
import { getVisibleMonths, usePlot } from '@/visualizations/graph-hooks';
import { PALETTE } from '@/design-system/palette';

export const topExcess = 14;
const bottomExcess = 24;
export const MonthSeparators: FC = () => {
  const {
    dateScale,
    dimensions: { height, width },
  } = usePlot();
  const monthDatesToPx = useCallback(
    (date: Date) => dateScale(startOfMonth(date)) ?? 0,
    [dateScale]
  );

  const visibleMonths = useMemo(() => {
    const [startDate, endDate] = dateScale.domain();
    return getVisibleMonths(startDate, endDate, dateScale).filter((month) => {
      const x = monthDatesToPx(month.date);
      return x > 0 && x < width;
    });
  }, [dateScale, monthDatesToPx, width]);

  return (
    <g>
      {visibleMonths.map((month, i) => {
        const x = monthDatesToPx(month.date);
        return (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={-topExcess}
            y2={height + bottomExcess}
            stroke={PALETTE.grey['100']}
            strokeWidth={0.5}
            pointerEvents="none"
          />
        );
      })}
    </g>
  );
};
