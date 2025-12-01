import { Card, Image, Stack, Text, VStack } from '@chakra-ui/react';
import { RouterLink, type Route } from '@/design-system/components/RouterLink';
import { useTranslation } from 'react-i18next';
import garminData from '@/assets/garmin_data.png';
import hrAnalysis from '@/assets/hr_analysis.png';
import heart3D from '@/assets/heart-3d.png';
import scatterPlot from '@/assets/scatter_plot.png';
import webGLInteractions from '@/assets/web-gl_interactions.png';
import stockData from '@/assets/stock_data.png';
type Sample = {
  title: string;
  description: string;
  img: string;
  link: Route;
};
const SAMPLES: Sample[] = [
  {
    title: 'HEARTBEAT_ANALYSIS.TITLE',
    description: 'HEARTBEAT_ANALYSIS.DESCRIPTION',
    img: hrAnalysis,
    link: '/heartbeat-analysis',
  },
  {
    title: 'GARMIN_SLEEP_DATA.TITLE',
    description: 'GARMIN_SLEEP_DATA.DESCRIPTION',
    img: garminData,
    link: '/garmin-sleep-data',
  },
  {
    title: 'STOCK_DATA.TITLE',
    description: 'STOCK_DATA.DESCRIPTION',
    img: stockData,
    link: '/stock-data',
  },
  {
    title: 'SCALED_SCATTER_PLOT.TITLE',
    description: 'SCALED_SCATTER_PLOT.DESCRIPTION',
    img: scatterPlot,
    link: '/scaled-scatter-plot',
  },
  {
    title: 'F_SHAPE.TITLE',
    description: 'F_SHAPE.DESCRIPTION',
    img: webGLInteractions,
    link: '/f-shape',
  },
  {
    title: 'HEART_3D.TITLE',
    description: 'HEART_3D.DESCRIPTION',
    img: heart3D,
    link: '/heart-3d',
  },
];
export const SamplesPage = () => {
  const { t } = useTranslation();
  return (
    <VStack alignItems={{ base: 'center', sm: 'start' }} gap="lg">
      <Text textStyle="h3">{t('SAMPLES.TITLE')}</Text>
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        width="full"
        flexWrap="wrap"
        gap="lg"
        height="full"
        alignItems={{ base: 'center', sm: 'start' }}
      >
        {SAMPLES.map((sample) => (
          <RouterLink to={sample.link} key={sample.link}>
            <Card.Root width="320px" boxShadow="lg">
              <Card.Body gap="2">
                <Image src={sample.img} border="sm" borderColor="border.primary" />
                <Card.Title mt="2">{t(sample.title)}</Card.Title>
                <Card.Description>{t(sample.description)}</Card.Description>
              </Card.Body>
            </Card.Root>
          </RouterLink>
        ))}
      </Stack>
    </VStack>
  );
};
