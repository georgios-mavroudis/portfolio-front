import { PlotProvider } from '@/visualizations/components/PlotContext';
import { useMemo, useState } from 'react';
import { HEIGHT, MAX_Y_POINT, SLIDER_MAX, SLIDER_MIN } from './constants';
import { HStack, Slider, Text, VStack } from '@chakra-ui/react';
import { ScatterGraph } from './ScatterGraph';

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

  return (
    <VStack alignItems="start">
      <Text>Scaled Scatter Plot</Text>
      <Text>
        A page where you can easily render thousands of points in the browser through webGL with no
        impact on performance
      </Text>
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
          <Text>Number of points: {sliderValue}</Text>
        </VStack>
        <PlotProvider>
          <ScatterGraph data={data} />
        </PlotProvider>
      </HStack>
    </VStack>
  );
};
