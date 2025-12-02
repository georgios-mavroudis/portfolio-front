import type { Data } from '@/types/sleep-data-types';
import { useEffect, useMemo } from 'react';
import { inRange } from '@/common/helpers';
import { getInitialYScale, usePlot } from '@/visualizations/graph-hooks';
import { SLEEP_SCORE } from './constants';

type Props = {
  data: Data[];
  children: (props: { data: Data[] }) => React.ReactNode;
};
export const DataContainer = ({ data, children }: Props) => {
  const {
    dateScale,
    setDateScale,
    setYScale,
    dimensions: { width, height },
    yAxisDisplay,
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

  useEffect(() => {
    const copy = dateScale.copy().range([0, width]);
    setDateScale(copy);
    setYScale(getInitialYScale(yAxisDisplay ?? SLEEP_SCORE, height));
  }, [width, height]);

  // useEffect(() => {}, []);
  return <>{children({ data: renderableData })}</>;
};
