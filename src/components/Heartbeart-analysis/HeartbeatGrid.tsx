import { type FC } from 'react';
import { GRID_MS, GRID_MV, GRID_UNIT_SIZE, squareToPixel } from './helpers';
import { PALETTE } from '@/design-system/palette';
import { usePlot } from '../SleepData/hooks';

const MINIMUM_SPACING = squareToPixel(1 / 4);

export const HeartbeatGrid: FC = () => {
  const id = 'grid';
  const { yScale, xScale } = usePlot();
  const sizeY = yScale(yScale.domain()[0] + GRID_MV);
  const sizeX = xScale(xScale.domain()[0] + GRID_MS);
  const pointsY = makePoints(sizeY);
  const pointsX = makePoints(sizeX);
  const showLineY = sizeY > MINIMUM_SPACING;
  const showLineX = sizeX > MINIMUM_SPACING;

  return (
    <g className="grid">
      <defs>
        <pattern id={id} width={sizeX} height={sizeY} patternUnits="userSpaceOnUse">
          {showLineX && (
            <line
              x1={0}
              y1={0}
              x2={sizeX}
              y2={0}
              stroke={PALETTE.orange[600]}
              strokeWidth={GRID_UNIT_SIZE}
            />
          )}
          {showLineY && (
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={sizeY}
              stroke={PALETTE.orange[600]}
              strokeWidth={GRID_UNIT_SIZE}
            />
          )}
          {pointsX.map((i, iIndex) => (
            <g key={`horizontal-${iIndex}-${id}`}>
              {pointsY.map((j, jIndex) => (
                <rect
                  key={`vertical-${jIndex}-${id}`}
                  x={i}
                  y={j}
                  height={sizeY / 25}
                  width={sizeX / 25}
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
