import { useEffect, useRef, type FC } from 'react';
import { drawBeat } from './utils';
import { useGraphColors } from '@/design-system/hooks';
import { usePlot } from '@/visualizations/graph-hooks';
import type { HeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';
import { calculateHeartBeat, getViewerLength } from './helpers';

type Props = {
  data: number[];
  offsetY?: number;
  isAnimationActive: boolean;
  setHeartbeat: (heartbeat: number) => void;
  QRS: HeartbeatData['annotations']['QRS'];
  frequency: number;
};
export const Strip: FC<Props> = ({
  data,
  offsetY = 0,
  isAnimationActive,
  setHeartbeat,
  frequency,
  QRS,
}) => {
  const animateId = useRef<number>(null);
  const stripRef = useRef<HTMLCanvasElement>(null);
  const {
    xScale,
    yScale,
    dimensions: { width, height },
  } = usePlot();
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

        const lastIdx = idx + getViewerLength(frequency, { width, height });
        let chunk = data.slice(idx, lastIdx);
        let bpm = calculateHeartBeat(idx, lastIdx, QRS, frequency);

        // This is for displaying purposes only because the ecg sample is small and
        // it never reaches the end, we do a loop so when it arrives at the end it picks
        // up from the beginning so the below part would be removed in a real application
        // TODO: remove the looping logic below once we have the backend data
        // because it messes the heartbeat value
        if (lastIdx > lastDataIdx) {
          const bpmStartChunk = calculateHeartBeat(0, lastIdx - lastDataIdx, QRS, frequency);
          bpm = bpmStartChunk !== 0 ? Math.round((bpm + bpmStartChunk) / 2) : bpm;
          chunk = [...chunk, ...data.slice(0, lastIdx - lastDataIdx)];
        }
        // =======================================
        setHeartbeat(bpm);
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

    const animateData = () => {
      draw();
      if (isAnimationActive) {
        animateId.current = requestAnimationFrame(animateData);
      }
    };
    animateData();
    return () => cancelAnimationFrame(animateId.current ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xScale, yScale, data, height, width, strip, isAnimationActive, QRS, frequency]);

  return (
    <canvas
      ref={stripRef}
      style={{ position: 'absolute', top: offsetY }}
      height={height}
      width={width}
    />
  );
};
