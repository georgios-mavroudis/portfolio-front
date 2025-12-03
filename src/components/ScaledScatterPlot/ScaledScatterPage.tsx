import { PlotProvider } from '@/visualizations/components/PlotContext';
import { useMemo, useState } from 'react';
import { MAX_Y_POINT, SLIDER_MAX, SLIDER_MIN } from './constants';
import { Slider, Stack, Text, VStack } from '@chakra-ui/react';
import { ScatterGraph } from './ScatterGraph';
import { useTranslation } from 'react-i18next';

export const ScaledScatterPage = () => {
  const [sliderValue, setSliderValue] = useState(100);
  // TODO: replace the data below with a streaming request to the backend and
  const data = useMemo<Float32Array<ArrayBuffer>>(
    () =>
      new Float32Array(
        Array.from({ length: sliderValue })
          .map((_, i) => [i, Math.round(Math.random() * MAX_Y_POINT)])
          .flat()
      ),
    [sliderValue]
  );
  const { t } = useTranslation();

  return (
    <VStack alignItems={{ base: 'center', sm: 'start' }}>
      <Text textStyle="h3">{t('SCALED_SCATTER_PLOT.TITLE')}</Text>
      <Text textAlign={{ base: 'center', sm: 'start' }}>
        {t('SCALED_SCATTER_PLOT.DESCRIPTION')}
      </Text>
      <Stack
        direction={{ base: 'column', sm: 'column', md: 'row' }}
        justifyContent="space-between"
        width="full"
      >
        <VStack alignItems={{ base: 'center', sm: 'start' }} justifyContent={'start'}>
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
          <Text textStyle="sm">
            {t('SCALED_SCATTER_PLOT.POINTS_LABEL')}: {sliderValue}
          </Text>
        </VStack>
        <PlotProvider>
          <ScatterGraph positions={data} />
        </PlotProvider>
      </Stack>
    </VStack>
  );
};
