import { type FC } from 'react';
import { GRID_MV, GRID_UNIT_SIZE, squareToPixel } from './helpers';
import { PALETTE } from '@/design-system/palette';
import { usePlot } from '../SleepData/hooks';

const MINIMUM_SPACING = squareToPixel(1 / 4);

export const HeartbeatGrid: FC = () => {
  const id = 'grid';
  const { yScale } = usePlot();
  console.log(yScale.domain()[0], yScale.range());
  const size = yScale(yScale.domain()[0] + GRID_MV);
  const points = makePoints(size);
  const showLine = size > MINIMUM_SPACING;

  return (
    <g className="grid">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          {showLine && (
            <line
              x1={0}
              y1={0}
              x2={size}
              y2={0}
              stroke={PALETTE.orange[600]}
              strokeWidth={GRID_UNIT_SIZE}
            />
          )}
          {showLine && (
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={size}
              stroke={PALETTE.orange[600]}
              strokeWidth={GRID_UNIT_SIZE}
            />
          )}
          {points.map((i, iIndex) => (
            <g key={`horizontal-${iIndex}-${id}`}>
              {points.map((j, jIndex) => (
                <rect
                  key={`vertical-${jIndex}-${id}`}
                  x={i}
                  y={j}
                  height={size / 25}
                  width={size / 25}
                  fill={PALETTE.orange[600]}
                />
              ))}
            </g>
          ))}
        </pattern>
      </defs>
      <rect className="grid" height="100%" width="100%" fill={`url("#${id}")`} />
      <line
        x1={0}
        y1="100%"
        x2="100%"
        y2="100%"
        stroke={PALETTE.orange[600]}
        strokeWidth={GRID_UNIT_SIZE}
      />
      <line
        x1="100%"
        y1={0}
        x2="100%"
        y2="100%"
        stroke={PALETTE.orange[600]}
        strokeWidth={GRID_UNIT_SIZE}
      />
    </g>
  );
};
const makePoints = (size: number) => [1, 2, 3, 4].map((i) => (i * size) / 5);
