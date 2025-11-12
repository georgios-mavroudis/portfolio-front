import type { Data } from '@/types/sleep-data-types';
import { type FC } from 'react';
import { addInterval, usePlot } from '@/visualizations/graph-hooks';
import { useGraphColors } from '../../design-system/hooks';

type Props = {
  data: Data[];
};

export const SleepIndicator: FC<Props> = ({ data }) => {
  const {
    dateScale,
    dimensions: { width },
  } = usePlot();
  const {
    sleepData: { wokeTime, bedTime },
  } = useGraphColors();
  return (
    <g>
      <rect x={0} width={width} y={0} height={2} fill={wokeTime} />
      {data.map(({ wakeTime, duration }, i) => {
        const x1 = addInterval(wakeTime, duration);

        return (
          <g key={i}>
            <rect
              x={dateScale(x1)}
              width={dateScale(wakeTime) - dateScale(x1)}
              y={0}
              height={2}
              fill={bedTime}
            />
          </g>
        );
      })}
    </g>
  );
};
