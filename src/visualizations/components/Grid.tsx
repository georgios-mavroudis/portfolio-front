import { type FC } from 'react';
import { usePlot, useYTicks } from '@/visualizations/graph-hooks';
import { PALETTE } from '@/design-system/palette';

export const Grid: FC = () => {
  const ticks = useYTicks();
  const {
    dimensions: { width },
  } = usePlot();
  return (
    <g>
      {ticks.map((tick, i) => (
        <line
          key={i}
          y1={tick}
          y2={tick}
          x1={0}
          x2={width}
          stroke={PALETTE.grey[100]}
          strokeWidth={0.5}
        />
      ))}
    </g>
  );
};
