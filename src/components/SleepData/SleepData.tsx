import { PlotProvider } from '@/visualizations/components/PlotContext';
import { Flex, Loader, Text, VStack } from '@chakra-ui/react';
import { Graph } from './Graph';
import json from '@/components/SleepData/data.json';
import type { Data } from '@/types/sleep-data-types';
import type { Interval } from '@/visualizations/constants';
import { DataContainer } from './DataContainer';
import { Alert } from '@/design-system/components/Alert';

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
  const data = { data: convertStringToDate(json), isSuccess: true, isError: false };

  if (!data.isSuccess) {
    return <Loader />;
  }

  if (data.isError) {
    return (
      <Alert title="No data found!" description="The request returned with error" status="error" />
    );
  }

  return (
    <Flex height="full">
      <VStack width="full" gap="md" height="full">
        <VStack alignItems="start" width="full">
          <Text textStyle="h2">Garmin sleep data</Text>
          <Text>A graph that displays sleep data coming from a garmin smartwatch</Text>
        </VStack>
        <Flex width="full">
          <PlotProvider>
            <DataContainer data={data.data}>
              {({ data: renderableData }) => <Graph data={renderableData} />}
            </DataContainer>
          </PlotProvider>
          {/* <Box>
          </Box> */}
        </Flex>
      </VStack>
    </Flex>
  );
};
