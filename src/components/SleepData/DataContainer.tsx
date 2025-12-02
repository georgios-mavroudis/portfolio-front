import type { Data } from '@/types/sleep-data-types';
import { useEffect, useMemo } from 'react';
import { inRange } from '@/common/helpers';
import { getInitialYScale, usePlot } from '@/visualizations/graph-hooks';
import { SLEEP_SCORE } from './constants';
import { useThemeBreakpointValue } from '@/design-system/tokens/breakpoints';
import { BREAKPOINTS_TO_HEIGHT_MAPPING } from '@/visualizations/constants';

type Props = {
  data: Data[];
  children: (props: { data: Data[] }) => React.ReactNode;
};
export const DataContainer = ({ data, children }: Props) => {
  const {
    dateScale,
    setDateScale,
    setYScale,
    dimensions: { width },
    yAxisDisplay,
    setDimensions,
  } = usePlot();

  /**
   * We dont want to render the data that are not visible for performance reasons
   * so we filter them out them.
   * */
  const renderableData = useMemo(() => {
    const [minDate, maxDate] = dateScale.domain();
    const halfPeriod = (maxDate.getTime() - minDate.getTime()) / 2;
    const adjustedMinDate = new Date(minDate.getTime() - 0.1 * halfPeriod);

    return data.filter((datum) =>
      inRange(datum.bedTime.getTime(), adjustedMinDate.getTime(), maxDate.getTime())
    );
  }, [data, dateScale]);

  const currentBreakpoint = useThemeBreakpointValue();

  useEffect(() => {
    const copy = dateScale.copy().range([0, width]);
    setDateScale(copy);
  }, [width]);

  useEffect(() => {
    const heightValue = BREAKPOINTS_TO_HEIGHT_MAPPING[currentBreakpoint];
    setDimensions({ height: heightValue });
    setYScale(getInitialYScale(yAxisDisplay ?? SLEEP_SCORE, heightValue));
  }, [currentBreakpoint]);
  return <>{children({ data: renderableData })}</>;
};
