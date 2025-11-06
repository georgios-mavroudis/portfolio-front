import type { Data } from '@/types/sleep-data-types';
import { useMemo } from 'react';
import { usePlot } from './hooks';
import { inRange } from '@/common/helpers';

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
    return data.filter((datum) =>
      inRange(datum.bedTime.getTime(), minDate.getTime(), maxDate.getTime())
    );
  }, [data, dateScale]);
  return <>{children({ data: renderableData })}</>;
};
