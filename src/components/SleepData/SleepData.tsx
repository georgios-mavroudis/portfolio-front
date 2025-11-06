import { PlotProvider } from '@/visualizations/components/PlotContext';
import { Box, Flex, Loader, Stack } from '@chakra-ui/react';
import { Graph } from './Graph';
import json from '@/components/SleepData/data.json';
import type { Data } from '@/types/sleep-data-types';
import type { Interval } from '@/visualizations/constants';
import { DataContainer } from './DataContainer';

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
  //  const { id } = useParams();
  // const data = useData(id);
  // TODO: Change this with data from the server
  const data = { data: convertStringToDate(json), isSuccess: true, isError: false };

  if (!data.isSuccess) {
    return <Loader />;
  }

  // if (data.isError) {
  //   return <CustomAlert message="No Patient data found!" status="error" />;
  // }

  // if (patientQuery.isError) {
  //   return <CustomAlert message="No found!" status="error" />;
  // }
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} height="100%" marginBottom="xl">
      <Stack width="100%" gap="s" height="100%" overflow={{ base: 'visible', lg: 'auto' }}>
        <Flex
          justifyContent="center"
          width="100%"
          marginTop="m"
          display={{ base: 'none', sm: 'inherit' }}
        >
          <Box marginX="m">
            <PlotProvider>
              <DataContainer data={data.data}>
                {({ data: renderableData }) => <Graph data={renderableData} />}
              </DataContainer>
            </PlotProvider>
          </Box>
        </Flex>
      </Stack>
    </Flex>
  );
};
