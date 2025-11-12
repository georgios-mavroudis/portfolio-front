import type { Data } from '@/types/sleep-data-types';
import { useMemo } from 'react';
import { inRange } from '@/common/helpers';
import { usePlot } from '@/visualizations/graph-hooks';

type Props = {
  data: Data[];
  children: (props: { data: Data[] }) => React.ReactNode;
};
export const DataContainer = ({ data, children }: Props) => {
  const { dateScale } = usePlot();

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
  return <>{children({ data: renderableData })}</>;
};
