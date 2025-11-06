import { useEffect, useRef, type FC } from 'react';
import { drawBeat } from './utils';
import { usePlot } from '../SleepData/hooks';
import { useGraphColors } from '@/design-system/hooks';
import { BEAT_LENGTH } from './Graph';
import { clamp } from '@/common/helpers';
import { useScale } from '@/visualizations/graph-hooks';

type Props = {
  yDomain: { min: number; max: number };
  yRange: { min: number; max: number };
  height: number;
  width: number;
  data: number[];
  offsetY: number;
  isAnimationActive: boolean;
};
export const Strip: FC<Props> = ({
  yDomain,
  yRange,
  height,
  width,
  data,
  offsetY,
  isAnimationActive,
}) => {
  const { min, max } = yDomain;
  const { min: rMin, max: rMax } = yRange;
  const animateId = useRef<number>(null);
  const stripRef = useRef<HTMLCanvasElement>(null);
  const { xScale } = usePlot();
  const yScale = useScale({ domain: { start: min, end: max }, range: { start: rMin, end: rMax } });
  const {
    heartBeat: { strip },
  } = useGraphColors();
  const count = useRef(0);

  useEffect(() => {
    const lastDataIdx = data.length - 1;

    const draw = () => {
      if (stripRef.current != null) {
        const idx = (animateId.current ?? 0) % lastDataIdx;
        count.current++;

        const lastIdx = clamp(idx + count.current, idx, idx + BEAT_LENGTH);
        let chunk = data.slice(idx, lastIdx);
        if (lastIdx > lastDataIdx) {
          chunk = [...chunk, ...data.slice(0, lastIdx - lastDataIdx)];
        }
        drawBeat({
          yScale,
          xScale,
          beat: chunk,
          beatStripEl: stripRef.current,
          canvasHeight: height,
          canvasWidth: width,
          color: strip,
        });
      }
    };

    if (isAnimationActive) {
      const animateData = () => {
        draw();
        animateId.current = requestAnimationFrame(animateData);
      };
      animateData();
    } else {
      // Run draw again to update any data changed while on pause mode
      draw();
    }
    return () => cancelAnimationFrame(animateId.current ?? 0);
  }, [xScale, yScale, data, height, width, strip, isAnimationActive]);

  return <canvas ref={stripRef} style={{ position: 'absolute', top: offsetY }} height={height} />;
};
