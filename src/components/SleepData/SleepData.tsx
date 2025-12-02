import { PlotProvider } from '@/visualizations/components/PlotContext';
import { Loader, Stack, Text, VStack } from '@chakra-ui/react';
import { Graph } from './Graph';
import json from '@/components/SleepData/data.json';
import type { Data } from '@/types/sleep-data-types';
import type { Interval } from '@/visualizations/constants';
import { DataContainer } from './DataContainer';
import { Alert } from '@/design-system/components/Alert';
import { useTranslation } from 'react-i18next';

// TODO: Move this to sleep data api query
type ApiSleepData = {
  id: number;
  bedTime: string;
  wakeTime: string;
  meanHr: number;
  score: number;
  duration: Interval;
};
const convertStringToDate = (
  data: {
    id: number;
    bedTime: string;
    wakeTime: string;
    meanHr: number;
    score: number;
    duration: Interval;
  }[]
): Data[] => {
  return data.map((item) => ({
    ...item,
    bedTime: new Date(item.bedTime),
    wakeTime: new Date(item.wakeTime),
  }));
};
export const SleepData = () => {
  // TODO: Change this with data from the server
  const data = {
    data: convertStringToDate(json as ApiSleepData[]),
    isSuccess: true,
    isError: false,
  };

  const { t } = useTranslation();
  if (!data.isSuccess) {
    return <Loader />;
  }

  if (data.isError) {
    return (
      <Alert
        title={t('NOT_FOUND.NO_DATA')}
        description={t('NOT_FOUND.DESCRIPTION')}
        status="error"
      />
    );
  }

  return (
    <Stack height="full">
      <VStack width="full" gap="md" height="full">
        <VStack alignItems={{ base: 'center', sm: 'start' }} width="full">
          <Text textStyle="h3">{t('GARMIN_SLEEP_DATA.TITLE')}</Text>
          <Text textAlign={{ base: 'center', sm: 'start' }}>
            {t('GARMIN_SLEEP_DATA.DESCRIPTION')}
          </Text>
        </VStack>
        <Stack width="full">
          <PlotProvider>
            <DataContainer data={data.data}>
              {({ data: renderableData }) => <Graph data={renderableData} />}
            </DataContainer>
          </PlotProvider>
        </Stack>
      </VStack>
    </Stack>
  );
};
