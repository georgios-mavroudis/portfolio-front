import { Box, VStack } from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import { HeartbeatGrid } from './HeartbeatGrid';
import { usePlot } from '../SleepData/hooks';
import { scaleLinear } from 'd3-scale';
import { GRID_HEIGHT, GRID_WIDTH } from '@/visualizations/constants';
import { Strip } from './Strip';
import { GRID_MS, GRID_MV } from './helpers';
import { Ruler } from './Ruler';
import type { HeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';

const MV_HEIGHT = 2 * GRID_MV;
export const BEAT_HEIGHT = GRID_HEIGHT * 2;

// one square box grid = 0.5ms / 200mV
// for 360 frequency we have 1 s --> 360 fiducial points so .5 ms --> 180 points
// On the y axis we want to display a height of 2mV [-1mV, 1mV] --> 4 boxes * 0.5mV
// BEAT_HEIGHT --> 4 boxes, GRID_WIDTH --> ? boxes
// boxes in x axis --> (GRID_WIDTH / BEAT_HEIGHT) * 4 --> (980 / 220) * 4 = 17.8182 boxes
// to ms: 17.8182 * GRID_MS (=200ms) --> 3563.64 ms
export const BEAT_LENGTH = ((GRID_WIDTH * 4) / BEAT_HEIGHT) * GRID_MS;

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
    setXScale(scaleLinear().domain([0, BEAT_LENGTH]).range([0, GRID_WIDTH]));
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
            <HeartbeatGrid />
          </svg>
          <Strip
            data={beat}
            height={BEAT_HEIGHT}
            yRange={{ min: 0, max: BEAT_HEIGHT }}
            yDomain={{ min: -MV_HEIGHT, max: MV_HEIGHT }}
            width={GRID_WIDTH}
            isAnimationActive={playAnimation}
            setHeartbeat={setHeartbeat}
            frequency={frequency}
            QRS={annotations.QRS}
          />
          {rulerActive && <Ruler />}
        </Box>
      ))}
    </VStack>
  );
};
