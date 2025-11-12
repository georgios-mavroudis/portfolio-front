import { getSleepDurationPalette, usePlot } from '@/visualizations/graph-hooks';
import type { Data } from '@/types/sleep-data-types';
import { type FC } from 'react';
import { PALETTE } from '@/design-system/palette';
import { useGraphColors } from '../../design-system/hooks';

type Props = {
  data: Data[];
  hoveredBar: Data | null;
};

const TEXT_PADDING = 5;
const VISIBLE_TEXT_ZOOM = 2;
const PIXEL_SIZE = 2;
const MINIMUM_WIDTH_FACTOR = 6;
const MAX_FONT_SIZE = 30;

export const ScorePlot: FC<Props> = ({ data, hoveredBar }) => {
  const {
    dateScale,
    yScale,
    transform,
    dimensions: { height },
  } = usePlot();
  const {
    sleepData: { sleepScorePalette },
    text,
  } = useGraphColors();
  return (
    <>
      {data
        .filter(({ score }) => score)
        .map(({ id, duration, wakeTime, bedTime, score }) => {
          const filteredScore = score as number;
          const durationColor = getSleepDurationPalette(duration, sleepScorePalette);
          const barHeight = height + yScale(filteredScore as number) - height;
          const barWidth =
            wakeTime && bedTime
              ? dateScale(wakeTime) - dateScale(bedTime)
              : MINIMUM_WIDTH_FACTOR * transform.k;
          const isHovering = hoveredBar?.id === id;
          return (
            <g key={id}>
              <g
                transform={
                  hoveredBar?.id === id ? `translate(${-PIXEL_SIZE / 2}, ${-PIXEL_SIZE})` : ''
                }
              >
                <rect
                  clipPath={'url(#round-corner)'}
                  fill={durationColor}
                  x={dateScale(bedTime ?? 0)}
                  width={barWidth + (isHovering ? PIXEL_SIZE : 0)}
                  y={height - yScale(filteredScore)}
                  height={barHeight + (isHovering ? PIXEL_SIZE : 0)}
                  stroke={isHovering ? PALETTE.brand['100'] : durationColor}
                  strokeWidth={1.5}
                  opacity={isHovering ? 0.7 : 1}
                  ry={3}
                />
              </g>
              <g
                transform={`translate(${dateScale(bedTime ?? 0)}, ${
                  height - yScale(filteredScore) - TEXT_PADDING
                })`}
              >
                {transform.k > VISIBLE_TEXT_ZOOM && (
                  <text
                    fill={text}
                    strokeWidth={0}
                    style={{
                      fontSize:
                        PIXEL_SIZE * transform.k < MAX_FONT_SIZE
                          ? PIXEL_SIZE * transform.k
                          : MAX_FONT_SIZE,
                    }}
                  >
                    {duration.hours ? `${duration.hours}h` : ''}
                    {duration.minutes ? ` ${duration.minutes}m` : ''}
                  </text>
                )}
              </g>
            </g>
          );
        })}
    </>
  );
};
