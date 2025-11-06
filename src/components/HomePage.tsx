import { HStack, Link, List, Text, VStack } from '@chakra-ui/react';
import type { FC } from 'react';

export const HomePage: FC = () => {
  return (
    <VStack alignItems="start" p={2}>
      <Text>Projects</Text>
      <List.Root ps="5">
        <List.Item> [ ] About me page</List.Item>
        <List.Item> [ ] Fluid visualization for the background</List.Item>
        <List.Item> [ ] Add internationalization (French and english)</List.Item>
        <List.Item>
          [ ] HeartBeat iteration (canvas)
          <List.Root ps="5">
            <List.Item>[x] A heartbeat that moves along a graph</List.Item>
            <List.Item>[x] Will be able to stop the movement</List.Item>
            <List.Item>[x] Create a ruler</List.Item>
            <List.Item>[x] Add Heart icon and animation</List.Item>
            <List.Item>[ ] Add Tooltip on the toolbar buttons</List.Item>
          </List.Root>
        </List.Item>
        <List.Item>
          [ ] Heart WebGL
          <List.Root ps="5">
            <List.Item>zoom, and rotate around the center of the heart</List.Item>
          </List.Root>
        </List.Item>
        <List.Item>
          [ ] Lungs CT scan
          <List.Root ps="5">
            <List.Item>zoom</List.Item>
            <List.Item>paint over areas</List.Item>
            <List.Item>export an image ??</List.Item>
          </List.Root>
        </List.Item>
        <List.Item>
          <HStack>
            <Text>[ ] Financial Chart</Text>
            <Link
              href="https://www.scichart.com/blog/using-javascript-for-financial-charts/"
              target="_blank"
            >
              (scichart)
            </Link>
          </HStack>
        </List.Item>
        <List.Item>[ ] Dashboard like tsuga???</List.Item>
      </List.Root>
    </VStack>
  );
};
