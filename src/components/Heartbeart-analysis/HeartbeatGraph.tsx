import { Box, VStack } from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import { HeartbeatGrid } from './HeartbeatGrid';
import { usePlot } from '../SleepData/hooks';
import { scaleLinear } from 'd3-scale';
import { GRID_HEIGHT, GRID_WIDTH } from '@/visualizations/constants';
import { Strip } from './Strip';
import { GRID_MV } from './helpers';
import { Ruler } from './Ruler';

const MV_HEIGHT = 2 * GRID_MV;
export const BEAT_HEIGHT = GRID_HEIGHT * 2;
export const BEAT_LENGTH = 3600;
type Props = {
  leads: Record<string, number[]>;
  rulerActive: boolean;
  playAnimation: boolean;
};
export const HeartbeatGraph: FC<Props> = ({ leads, rulerActive, playAnimation }) => {
  const { setXScale, setYScale } = usePlot();
  useEffect(() => {
    // We initialize the scales to the appropriate ranges and domains
    setYScale(scaleLinear().domain([-MV_HEIGHT, MV_HEIGHT]).range([0, BEAT_HEIGHT]));
    setXScale(scaleLinear().domain([0, BEAT_LENGTH]).range([0, GRID_WIDTH]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            // offsetY={yScale(-MV_HEIGHT + GRID_MV)}
            offsetY={0}
            isAnimationActive={playAnimation}
          />
          {rulerActive && <Ruler />}
        </Box>
      ))}
    </VStack>
  );
};
