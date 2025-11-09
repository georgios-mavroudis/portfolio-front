import { Box, VStack } from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import { HeartbeatGrid } from './HeartbeatGrid';
import { scaleLinear } from 'd3-scale';
import { GRID_WIDTH } from '@/visualizations/constants';
import { Strip } from './Strip';
import { Ruler } from './Ruler';
import type { HeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';
import { usePlot } from '@/visualizations/graph-hooks';
import { BEAT_HEIGHT, getViewerLength, MV_HEIGHT } from './helpers';

type Props = {
  data: HeartbeatData;
  rulerActive: boolean;
  playAnimation: boolean;
  setHeartbeat: (heartbeat: number) => void;
};

export const HeartbeatGraph: FC<Props> = ({ data, rulerActive, playAnimation, setHeartbeat }) => {
  const { leads, frequency, annotations } = data;
  const { setXScale, setYScale } = usePlot();
  useEffect(() => {
    // We initialize the scales to the appropriate ranges and domains
    setYScale(scaleLinear().domain([-MV_HEIGHT, MV_HEIGHT]).range([0, BEAT_HEIGHT]));
    setXScale(
      scaleLinear()
        .domain([0, getViewerLength(frequency)])
        .range([0, GRID_WIDTH])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <VStack alignItems="start">
      {Object.entries(leads).map(([key, beat]) => (
        <Box boxShadow="md" key={key} position="relative">
          <svg
            style={{
              width: GRID_WIDTH,
              height: BEAT_HEIGHT,
            }}
            viewBox={`0 0 ${GRID_WIDTH} ${BEAT_HEIGHT}`}
          >
            <HeartbeatGrid frequency={frequency} />
          </svg>
          <Strip
            data={beat}
            height={BEAT_HEIGHT}
            width={GRID_WIDTH}
            isAnimationActive={playAnimation}
            setHeartbeat={setHeartbeat}
            frequency={frequency}
            QRS={annotations.QRS}
          />
          {rulerActive && <Ruler frequency={frequency} />}
        </Box>
      ))}
    </VStack>
  );
};
