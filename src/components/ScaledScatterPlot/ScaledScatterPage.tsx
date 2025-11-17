import { PlotProvider } from '@/visualizations/components/PlotContext';
import { useMemo, useState } from 'react';
import { HEIGHT, MAX_Y_POINT, SLIDER_MAX, SLIDER_MIN } from './constants';
import { HStack, Slider, Text, VStack } from '@chakra-ui/react';
import { ScatterGraph } from './ScatterGraph';
import { useTranslation } from 'react-i18next';

type Datum = {
  x: number;
  y: number;
};

export const ScaledScatterPage = () => {
  const [sliderValue, setSliderValue] = useState(100);
  // TODO: replace the data below with a streaming request to the backend and
  const data = useMemo<Datum[]>(
    () =>
      Array.from({ length: sliderValue }).map((_, i) => ({
        x: i,
        y: Math.round(Math.random() * MAX_Y_POINT),
      })),
    [sliderValue]
  );
  const { t } = useTranslation();
  return (
    <VStack alignItems="start">
      <Text>{t('SCALED_SCATTER_PLOT.TITLE')}</Text>
      <Text>{t('SCALED_SCATTER_PLOT.DESCRIPTION')}</Text>
      <HStack justifyContent="space-between" width="full">
        <VStack alignItems="start" height={HEIGHT} justifyContent={'start'}>
          <Slider.Root
            width={300}
            defaultValue={[sliderValue]}
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            onValueChangeEnd={(valueChange) => setSliderValue(valueChange.value[0])}
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
          <Text>
            {t('SCALED_SCATTER_PLOT.POINTS_LABEL')}: {sliderValue}
          </Text>
        </VStack>
        <PlotProvider>
          <ScatterGraph data={data} />
        </PlotProvider>
      </HStack>
    </VStack>
  );
};
