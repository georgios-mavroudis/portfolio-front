import { getSleepDurationPalette, usePlot, useResponsiveFont } from '@/visualizations/graph-hooks';
import type { Data } from '@/types/sleep-data-types';
import { useMemo, type FC } from 'react';
import { PALETTE } from '@/design-system/palette';
import { useGraphColors } from '../../design-system/hooks';
import { clamp } from '@/common/helpers';

type Props = {
  data: Data[];
  hoveredBar: Data | null;
};

const TEXT_PADDING = 5;
const VISIBLE_TEXT_ZOOM = 2;
const PIXEL_SIZE = 2;
const MINIMUM_WIDTH_FACTOR = 6;

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
    inverse: { text: inverseText },
  } = useGraphColors();
  const font = useResponsiveFont();
  const fontSize = useMemo(
    () => clamp(PIXEL_SIZE * transform.k, font, font + 10),
    [transform.k, font]
  );
  return (
    <>
      {data
        .filter(({ score }) => score)
        .map(({ id, duration, wakeTime, bedTime, score }) => {
          const filteredScore = score;
          const durationColor = getSleepDurationPalette(duration, sleepScorePalette);
          const barHeight = yScale(filteredScore);
          const barWidth =
            wakeTime && bedTime
              ? dateScale(wakeTime) - dateScale(bedTime)
              : MINIMUM_WIDTH_FACTOR * transform.k;
          const isHovering = hoveredBar?.id === id;
          const isTextOverflowing = height - yScale(filteredScore) - TEXT_PADDING - fontSize < 0;
          const textPosition = isTextOverflowing
            ? height - yScale(filteredScore) + fontSize
            : height - yScale(filteredScore) - TEXT_PADDING;
          const textColor = isTextOverflowing ? inverseText : text;
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
              <g transform={`translate(${dateScale(bedTime ?? 0)}, ${textPosition})`}>
                {transform.k > VISIBLE_TEXT_ZOOM && (
                  <text
                    fill={textColor}
                    strokeWidth={0}
                    style={{
                      fontSize,
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
