import { type FC, useMemo } from 'react';
import { topExcess } from './MonthSeparators';
import type { Data } from '@/types/sleep-data-types';
import { findMiddlePoint } from '@/components/SleepData/helpers';
import { useGraphColors } from '@/design-system/hooks';
import { usePlot } from '../graph-hooks';

type Props = {
  mouseX: number | null;
  datum: Data | null;
};

export const MouseLine: FC<Props> = ({ mouseX, datum }) => {
  const {
    dateScale,
    dimensions: { height, width },
  } = usePlot();
  const middlePoint = useMemo(
    () => (datum ? findMiddlePoint(datum.wakeTime, datum.duration) : null),
    [datum]
  );
  const { mouseLine } = useGraphColors();

  if (mouseX == null || mouseX < 0 || mouseX > width) {
    return null;
  }
  return (
    <line
      cursor={'grab'}
      x1={middlePoint ? dateScale(middlePoint) : mouseX}
      x2={middlePoint ? dateScale(middlePoint) : mouseX}
      y1={-topExcess}
      y2={height}
      stroke={mouseLine}
      strokeWidth={0.7}
      pointerEvents="none"
      opacity={0.5}
    />
  );
};
