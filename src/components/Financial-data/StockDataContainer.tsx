import { useEffect, useMemo } from 'react';
import { inRange } from '@/common/helpers';
import { usePlot } from '@/visualizations/graph-hooks';
import type { StockData } from '@/queries/stock-data/model';
import { scaleLinear } from 'd3-scale';
import type { UseQueryResult } from '@tanstack/react-query';
import { useThemeBreakpointValue } from '@/design-system/tokens/breakpoints';
import { BREAKPOINTS_TO_HEIGHT_MAPPING } from '@/visualizations/constants';

type Props = {
  data: UseQueryResult<StockData[], Error>;
  children: (props: { data: StockData[]; loading: boolean }) => React.ReactNode;
};

export const StockDataContainer = ({ data, children }: Props) => {
  const {
    setYScale,
    setYAxisDisplay,
    dateScale,
    setDimensions,
    dimensions: { width },
    setDateScale,
  } = usePlot();

  /**
   * We dont want to render the data that are not visible for performance reasons
   * so we filter them out them.
   * */
  const renderableData = useMemo(() => {
    const [minDate, maxDate] = dateScale.domain();
    const halfPeriod = (maxDate.getTime() - minDate.getTime()) / 2;
    const adjustedMinDate = new Date(minDate.getTime() - 0.1 * halfPeriod);
    if (!data.isSuccess) {
      return [];
    }

    return data.data.filter((datum) =>
      inRange(datum.date.getTime(), adjustedMinDate.getTime(), maxDate.getTime())
    );
  }, [data, dateScale]);

  // Because the width is responsive we need to set the scale every time
  useEffect(() => {
    const copy = dateScale.copy().range([0, width]);
    setDateScale(copy);
  }, [width]);

  const currentBreakpoint = useThemeBreakpointValue();

  useEffect(() => {
    setYAxisDisplay(null);
    const [min, max] = [
      Math.min(...renderableData.map((d) => d.low)),
      Math.max(...renderableData.map((d) => d.high)),
    ];

    const diff = max - min;
    setYScale(
      scaleLinear()
        .domain([min - 0.1 * diff, max + 0.1 * diff])
        .range([0, BREAKPOINTS_TO_HEIGHT_MAPPING[currentBreakpoint]])
    );
    setDimensions({ height: BREAKPOINTS_TO_HEIGHT_MAPPING[currentBreakpoint] });
  }, [renderableData, currentBreakpoint]);

  return <>{children({ data: renderableData, loading: !data.isSuccess })}</>;
};
