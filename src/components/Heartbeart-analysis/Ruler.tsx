import { useGraphColors } from '@/design-system/hooks';
import { usePlot } from '../SleepData/hooks';
import { useMemo } from 'react';

export const Ruler = () => {
  const {
    ruler: { x1, y1, x2, y2 },
    xScale,
    yScale,
  } = usePlot();
  const {
    heartBeat: { ruler, rulerBorder },
  } = useGraphColors();
  const { x, y, width, height } = useMemo(() => {
    const [xMin, xMax] = [Math.min(x1, x2), Math.max(x1, x2)];
    const [yMin, yMax] = [Math.min(y1, y2), Math.max(y1, y2)];
    const [x, width] = [xScale(xMin), xScale(xMax) - xScale(xMin)];
    const [y, height] = [yScale(yMin), yScale(yMax) - yScale(yMin)];
    return { x, y, width, height };
  }, [x1, x2, y1, y2, xScale, yScale]);
  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={ruler}
        opacity={0.5}
        stroke={rulerBorder}
      />
    </>
  );
};
