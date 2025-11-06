import { type FC, useMemo } from 'react';
import { isBefore } from 'date-fns';
import type { Data } from '@/types/sleep-data-types';
import { usePlot } from '@/components/SleepData/hooks';
import { findMiddlePoint } from '@/components/SleepData/helpers';
import { GRID_HEIGHT, HIGHLIGHTED_DOT_RADIUS, MINIMAL_DOT_RADIUS } from '../constants';
import { PALETTE } from '@/design-system/palette';
import { useGraphColors } from '../../design-system/hooks';

type Props = {
  data: Data[];
  mouseX: number | null;
  hoveredPoint: Data | null;
};

export const HRPlot: FC<Props> = ({ data, hoveredPoint }) => {
  const { dateScale, yScale, withLine } = usePlot();
  const filteredData = useMemo(
    () =>
      data
        .filter(({ meanHr }) => meanHr)
        .sort((a, b) => (isBefore(a.wakeTime, b.wakeTime) ? -1 : 1)),
    [data]
  );

  const path = useMemo(
    () =>
      filteredData
        .map(({ wakeTime, duration, meanHr }) => {
          const middleSleepPoint = findMiddlePoint(wakeTime, duration);
          return `${dateScale(middleSleepPoint)}, ${GRID_HEIGHT - yScale(meanHr as number)}`;
        })
        .join(' '),
    [filteredData, dateScale, yScale]
  );
  const {
    sleepData: { hrLine, hrPoint },
  } = useGraphColors();
  return (
    <>
      {withLine && <polyline points={path} fill="none" stroke={hrLine} strokeWidth={1} />}
      {filteredData.map(({ id, wakeTime, duration, meanHr }, i) => {
        const middleSleepPoint = findMiddlePoint(wakeTime, duration);
        if (!meanHr) {
          return <></>;
        }
        const isHovering = hoveredPoint?.id === id;

        return (
          <circle
            key={i}
            cx={dateScale(middleSleepPoint)}
            cy={GRID_HEIGHT - yScale(meanHr)}
            r={isHovering ? HIGHLIGHTED_DOT_RADIUS : MINIMAL_DOT_RADIUS}
            strokeWidth={isHovering ? 2 : 1}
            stroke={hrPoint}
            fill={isHovering ? PALETTE.common.white : hrPoint}
          />
        );
      })}
    </>
  );
};
