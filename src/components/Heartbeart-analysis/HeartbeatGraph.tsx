import { Box, HStack, Stack, Text, VStack } from '@chakra-ui/react';
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
  setGraphWidth: (width: number) => void;
};

export const HeartbeatGraph: FC<Props> = ({
  data,
  rulerActive,
  playAnimation,
  setHeartbeat,
  setGraphWidth,
}) => {
  const { leads, frequency, annotations } = data;
  const { ref, width: refWidth } = useResizeObserver();
  useEffect(() => {
    setGraphWidth(refWidth);
  }, [refWidth]);

  const {
    setXScale,
    setYScale,
    dimensions: { width, height },
  } = usePlot();

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
          <HStack alignItems="start" height="full">
            <Text>
              {t('HEARTBEAT_ANALYSIS.LEAD')}: {key}
            </Text>
          </HStack>
          <Box boxShadow="md" position="relative" bg="graph.background" width="full" ref={ref}>
            <svg
              style={{
                width: width,
                height: height,
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
          </Box>
        </Stack>
      ))}
    </VStack>
  );
};
