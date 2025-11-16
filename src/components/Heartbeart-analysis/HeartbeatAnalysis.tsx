import { PlotProvider } from '@/visualizations/components/PlotContext';
import { HeartbeatGraph } from './HeartbeatGraph';
import { useState } from 'react';
import { AbsoluteCenter, Box, Button, HStack, Spinner, Stat, Text, VStack } from '@chakra-ui/react';
import { Heart } from '@/design-system/custom-icons/Heart';
import { Play, Stop, Ruler as RulerIcon } from '@untitled-ui/icons-react';
import { useHeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';
import { Alert } from '@/design-system/components/Alert';
import { HeartbeatContainer } from './HeartbeatContainer';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/design-system/components/tooltip';

export const HeartBeatAnalysis = () => {
  const [rulerActive, setRulerActive] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(true);
  const data = useHeartbeatData();
  const [heartBeat, setHeartBeat] = useState<string | number>('--');
  const { t } = useTranslation();

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
      <VStack height="full" p="md">
        <HStack width="full" justifyContent="space-between">
          <VStack alignItems="start" justifyContent={'space-between'} height="full">
            <VStack alignItems="start">
              <HStack width="full" gap="md">
                <Heart />
                <Stat.Root>
                  <Stat.Label>{t('HEARTBEAT_ANALYSIS.HR')}</Stat.Label>
                  <Stat.ValueText>{heartBeat} bpm</Stat.ValueText>
                </Stat.Root>
              </HStack>
              <HStack>
                <Text textStyle="lg">{t('HEARTBEAT_ANALYSIS.FREQUENCY')}:</Text>
                <Text>{heartbeatData.frequency}</Text>
              </HStack>
              <HStack>
                <Text textStyle="lg">{t('HEARTBEAT_ANALYSIS.FILE_NAME')}:</Text>
                <Text>{heartbeatData.fileName}</Text>
              </HStack>
            </VStack>
            <HStack>
              <Box
                justifyContent="start"
                boxShadow="sm"
                p="sm"
                rounded="sm"
                bg="background.secondary"
              >
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setPlayAnimation(!playAnimation)}
                  mr={2}
                >
                  <Tooltip content={t('HEARTBEAT_ANALYSIS.TOOLBAR.TOGGLE_BEAT')}>
                    {playAnimation ? <Stop /> : <Play />}
                  </Tooltip>
                </Button>
                <Button
                  variant={rulerActive ? 'outline' : 'tertiary'}
                  size="sm"
                  onClick={() => setRulerActive(!rulerActive)}
                >
                  <Tooltip content={t('HEARTBEAT_ANALYSIS.TOOLBAR.TOGGLE_RULER')}>
                    <RulerIcon />
                  </Tooltip>
                </Button>
              </Box>
            </HStack>
          </VStack>
          <HStack height="full">
            <VStack height="full">
              {Object.keys(data.data.leads).map((key) => (
                <Stat.Root key={key} width={40} alignItems="end">
                  <Stat.Label>
                    {t('HEARTBEAT_ANALYSIS.LEAD')}: {key}
                  </Stat.Label>
                </Stat.Root>
              ))}
            </VStack>
            <HeartbeatContainer data={data.data}>
              {({ data }) => (
                <HeartbeatGraph
                  data={data}
                  playAnimation={playAnimation}
                  rulerActive={rulerActive}
                  setHeartbeat={setHeartBeat}
                />
              )}
            </HeartbeatContainer>
          </HStack>
        </HStack>
      </VStack>
    </PlotProvider>
  );
};
