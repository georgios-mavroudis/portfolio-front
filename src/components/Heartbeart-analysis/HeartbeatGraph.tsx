import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import { HeartbeatGrid } from './HeartbeatGrid';
import { scaleLinear } from 'd3-scale';
import { Strip } from './Strip';
import { Ruler } from './Ruler';
import type { HeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';
import { usePlot, useResizeObserver } from '@/visualizations/graph-hooks';
import { getViewerLength, MV_HEIGHT } from './helpers';
import { useTranslation } from 'react-i18next';

type Props = {
  data: HeartbeatData;
  rulerActive: boolean;
  playAnimation: boolean;
  setHeartbeat: (heartbeat: number) => void;
};

export const HeartbeatGraph: FC<Props> = ({ data, rulerActive, playAnimation, setHeartbeat }) => {
  const { leads, frequency, annotations } = data;
  const { ref, width: refWidth } = useResizeObserver<HTMLDivElement>();

  const {
    setXScale,
    setYScale,
    dimensions: { width, height },
    setDimensions,
  } = usePlot();

  useEffect(() => {
    setDimensions({ width: refWidth });
  }, [refWidth]);

  useEffect(() => {
    // We initialize the scales to the appropriate ranges and domains
    setYScale(scaleLinear().domain([-MV_HEIGHT, MV_HEIGHT]).range([0, height]));
    setXScale(
      scaleLinear()
        .domain([0, getViewerLength(frequency, { width, height })])
        .range([0, width])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, height, width, frequency]);

  const { t } = useTranslation();

  return (
    <VStack alignItems="start" width="full">
      {Object.entries(leads).map(([key, beat]) => (
        <Stack direction={{ base: 'column', sm: 'row' }} key={key} width="full">
          <HStack alignItems="start" height="full" width={20}>
            <Text>
              {t('HEARTBEAT_ANALYSIS.LEAD')}: {key}
            </Text>
          </HStack>
          <Stack boxShadow="md" position="relative" bg="graph.background" width="full" ref={ref}>
            <svg
              width="calc(100%)"
              height={height}
              style={{
                userSelect: 'none',
              }}
              viewBox={`0 0 ${width} ${height}`}
            >
              <HeartbeatGrid frequency={frequency} />
            </svg>
            <Strip
              data={beat}
              isAnimationActive={playAnimation}
              setHeartbeat={setHeartbeat}
              frequency={frequency}
              QRS={annotations.QRS}
            />
            {rulerActive && <Ruler frequency={frequency} />}
          </Stack>
        </Stack>
      ))}
    </VStack>
  );
};
