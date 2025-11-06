import { Box, Button, HStack, Stat, Tooltip, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState, type FC, type MouseEvent } from 'react';
import { HeartbeatGrid } from './Grid';
import { usePlot } from '../SleepData/hooks';
import { scaleLinear } from 'd3-scale';
import { GRID_HEIGHT, GRID_WIDTH } from '@/visualizations/constants';
import { Strip } from './Strip';
import { GRID_MV } from './helpers';
import json from './data.json';
import { Play, Ruler as RulerIcon, Stop } from '@untitled-ui/icons-react';
import { Ruler } from './Ruler';
import { pointer } from 'd3';

const MV_HEIGHT = 4 * GRID_MV;
const HEIGHT = GRID_HEIGHT * 1.5;
export const BEAT_LENGTH = 600;
export const HeartbeatGraph: FC = () => {
  // TODO: bug with the grid not having the correct size
  const [rulerActive, setRulerActive] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(true);
  // const ref = useRef<SVGSVGElement>(null);
  const beats = useMemo(
    () => ({
      // TODO: move the data to the server
      MLII: json['MLII'],
      V1: json['V1'],
      V5: json['V5'],
    }),
    []
  );

  const { setXScale, ruler, setYScale, xScale, yScale, setRuler } = usePlot();
  useEffect(() => {
    // We initialize the scales to the appropriate ranges and domains
    setYScale(scaleLinear().domain([-MV_HEIGHT, MV_HEIGHT]).range([0, HEIGHT]));
    setXScale(scaleLinear().domain([0, BEAT_LENGTH]).range([0, GRID_WIDTH]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRuler = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      if (rulerActive) {
        console.log(e.clientX);
        const [x, y] = pointer(e);
        const x1 = xScale.invert(x);
        const y1 = yScale.invert(y);
        console.log('y1', y1);
        setRuler({ x1, y1, x2: x1, y2: y1, rulerUpdating: true });
      }
    },
    [rulerActive, xScale, yScale]
  );
  const stopRuler = useCallback(() => {
    if (rulerActive) {
      setRuler({ rulerUpdating: false });
    }
  }, [rulerActive]);

  const mouseMove = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      // debouncedMouseMove(e, ruler);
      const { rulerUpdating, x1, y1 } = ruler;
      if (rulerUpdating) {
        const [eventX, eventY] = pointer(e);
        const x2 = xScale.invert(eventX);
        const y2 = yScale.invert(eventY);
        console.log('y2 ', y2);
        setRuler({ x1, y1, x2, y2 });
      }
    },
    [ruler, xScale, yScale]
  );

  // TODO: create an pulsing heart, with WebGL next to the the heartbeat
  // TODO: calculate the heartbeat
  return (
    <VStack height="full">
      <HStack width="full" gap={5} justifyContent="space-between">
        <VStack alignItems="start" height="full" width="full">
          <Stat.Root>
            <Stat.Label>HR </Stat.Label>
            <Stat.ValueText>72 bpm</Stat.ValueText>
          </Stat.Root>
        </VStack>
        <VStack alignItems="end" height="full" width="full">
          {Object.keys(beats).map((key) => (
            <Stat.Root key={key}>
              <Stat.Label>Lead: {key}</Stat.Label>
            </Stat.Root>
          ))}
        </VStack>
        <VStack alignItems="start">
          {Object.entries(beats).map(([key, beat]) => (
            <Box boxShadow="md" key={key} position="relative">
              <svg
                style={{
                  width: GRID_WIDTH,
                  height: HEIGHT,
                }}
                viewBox={`0 0 ${GRID_WIDTH} ${HEIGHT}`}
              >
                <HeartbeatGrid />
              </svg>
              <Strip
                data={beat}
                height={HEIGHT}
                yRange={{ min: 0, max: HEIGHT }}
                yDomain={{ min: -MV_HEIGHT, max: MV_HEIGHT }}
                width={GRID_WIDTH}
                offsetY={yScale(-MV_HEIGHT + GRID_MV)}
                isAnimationActive={playAnimation}
              />
              <svg
                width={GRID_WIDTH}
                height={HEIGHT}
                style={{
                  top: 0,
                  position: 'absolute',
                }}
                viewBox={`0 0 ${GRID_WIDTH} ${HEIGHT}`}
                onMouseDown={startRuler}
                onMouseUp={stopRuler}
                onMouseMove={mouseMove}
                cursor={rulerActive ? 'crosshair' : 'default'}
              >
                {rulerActive && <Ruler />}
              </svg>
            </Box>
          ))}
        </VStack>
      </HStack>
      <HStack width="full">
        <Box justifyContent="start" boxShadow="sm" p={2} rounded="sm" bg="background.secondary">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setPlayAnimation(!playAnimation)}
                mr={2}
              >
                {playAnimation ? <Stop /> : <Play />}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>
                <Tooltip.Arrow>
                  <Tooltip.ArrowTip />
                </Tooltip.Arrow>
                Pause heartbeat strip
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant={rulerActive ? 'outline' : 'tertiary'}
                size="sm"
                onClick={() => setRulerActive(!rulerActive)}
              >
                <RulerIcon />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content>
                <Tooltip.Arrow>
                  <Tooltip.ArrowTip />
                </Tooltip.Arrow>
                Toggle Ruler
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        </Box>
      </HStack>
    </VStack>
  );
};
