import { PlotProvider } from '@/visualizations/components/PlotContext';
import { HeartbeatGraph } from './HeartbeatGraph';
import { useMemo, useState } from 'react';
import json from './data.json';
import { Box, Button, HStack, Stat, VStack } from '@chakra-ui/react';
import { Heart } from '@/design-system/custom-icons/Heat';
import { Play, Stop, Ruler as RulerIcon } from '@untitled-ui/icons-react';

export const HeartBeatAnalysis = () => {
  const [rulerActive, setRulerActive] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(true);
  const leads = useMemo(
    () => ({
      // TODO: calculate the heartbeat
      // TODO: move the data to the server
      MLII: json['MLII'],
      V1: json['V1'],
      V5: json['V5'],
    }),
    []
  );
  return (
    <PlotProvider>
      <VStack height="full">
        <HStack width="full" gap={5} justifyContent="space-between">
          <VStack alignItems="start" height="full" width="full">
            <HStack width="full">
              <Heart />
              <Stat.Root>
                <Stat.Label>HR </Stat.Label>
                <Stat.ValueText>72 bpm</Stat.ValueText>
              </Stat.Root>
            </HStack>
          </VStack>
          <VStack alignItems="end" height="full" width="full">
            {Object.keys(leads).map((key) => (
              <Stat.Root key={key}>
                <Stat.Label>Lead: {key}</Stat.Label>
              </Stat.Root>
            ))}
          </VStack>
          <HeartbeatGraph leads={leads} playAnimation={playAnimation} rulerActive={rulerActive} />
        </HStack>
        <HStack width="full">
          <Box justifyContent="start" boxShadow="sm" p={2} rounded="sm" bg="background.secondary">
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setPlayAnimation(!playAnimation)}
              mr={2}
            >
              {playAnimation ? <Stop /> : <Play />}
            </Button>
            <Button
              variant={rulerActive ? 'outline' : 'tertiary'}
              size="sm"
              onClick={() => setRulerActive(!rulerActive)}
            >
              <RulerIcon />
            </Button>
          </Box>
        </HStack>
      </VStack>
    </PlotProvider>
  );
};
