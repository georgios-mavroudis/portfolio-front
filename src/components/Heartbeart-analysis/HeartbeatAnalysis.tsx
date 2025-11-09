import { PlotProvider } from '@/visualizations/components/PlotContext';
import { HeartbeatGraph } from './HeartbeatGraph';
import { useState } from 'react';
import { AbsoluteCenter, Box, Button, HStack, Spinner, Stat, Text, VStack } from '@chakra-ui/react';
import { Heart } from '@/design-system/custom-icons/Heart';
import { Play, Stop, Ruler as RulerIcon } from '@untitled-ui/icons-react';
import { useHeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';
import { Alert } from '@/design-system/components/Alert';

export const HeartBeatAnalysis = () => {
  const [rulerActive, setRulerActive] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(true);
  const data = useHeartbeatData();
  const [heartBeat, setHeartBeat] = useState<string | number>('--');

  if (!data.isSuccess) {
    return (
      <AbsoluteCenter>
        <Spinner color="primary.500" size="xl" />
      </AbsoluteCenter>
    );
  }
  if (data.isError) {
    return <Alert title="No Patient data found!" status="error" />;
  }
  const { data: heartbeatData } = data;
  return (
    <PlotProvider>
      <VStack height="full">
        <HStack width="full" gap={5} justifyContent="space-between">
          <VStack alignItems="start" justifyContent={'space-between'} height="full">
            <VStack alignItems="start">
              <HStack width="full" gap={5}>
                <Heart />
                <Stat.Root>
                  <Stat.Label>HR </Stat.Label>
                  <Stat.ValueText>{heartBeat} bpm</Stat.ValueText>
                </Stat.Root>
              </HStack>
              <HStack>
                <Text textStyle="lg">Frequency:</Text>
                <Text>{heartbeatData.frequency}</Text>
              </HStack>
              <HStack>
                <Text textStyle="lg">File name:</Text>
                <Text>{heartbeatData.fileName}</Text>
              </HStack>
            </VStack>
            <HStack>
              <Box
                justifyContent="start"
                boxShadow="sm"
                p={2}
                rounded="sm"
                bg="background.secondary"
              >
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
          <HStack height="full">
            <VStack alignItems="end" height="full" width={20}>
              {Object.keys(data.data.leads).map((key) => (
                <Stat.Root key={key}>
                  <Stat.Label>Lead: {key}</Stat.Label>
                </Stat.Root>
              ))}
            </VStack>
            <HeartbeatGraph
              data={data.data}
              playAnimation={playAnimation}
              rulerActive={rulerActive}
              setHeartbeat={setHeartBeat}
            />
          </HStack>
        </HStack>
      </VStack>
    </PlotProvider>
  );
};
