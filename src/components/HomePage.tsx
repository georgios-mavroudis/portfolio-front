import { HStack, Image, List, Text, VStack } from '@chakra-ui/react';
import type { FC } from 'react';
import png from '@/assets/profile.png';
import { useTranslation } from 'react-i18next';

export const HomePage: FC = () => {
  const { t } = useTranslation();
  return (
    <VStack alignItems="start" p={2}>
      <HStack width="full" justifyContent="center">
        <Text textStyle="h2">About me</Text>
        <Text>{t('ABOUT_ME.DESCRIPTION')}</Text>
        <Image src={png} width={400} rounded="md" border="2px solid red" />
      </HStack>
      <Text>Projects</Text>
      <List.Root ps="5">
        <List.Item> [ ] About me page</List.Item>
        <List.Item> [x] Fluid visualization for the background</List.Item>
        <List.Root ps="5">
          <List.Item> [x] Add internationalization (French and english)</List.Item>
          <List.Item> [] Add french translations to all strings</List.Item>
        </List.Root>
        <List.Item>
          [ ] HeartBeat iteration (canvas)
          <List.Root ps="5">
            <List.Item>[x] A heartbeat that moves along a graph</List.Item>
            <List.Item>[x] Will be able to stop the movement</List.Item>
            <List.Item>[x] Create a ruler</List.Item>
            <List.Item>[x] Add Heart icon and animation</List.Item>
            <List.Item>[ ] Add Tooltip on the toolbar buttons</List.Item>
            <List.Item>[ ] Add upload of dat files and parsing from the back</List.Item>
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
        <List.Item>[ ] Dashboard like tsuga???</List.Item>
      </List.Root>
    </VStack>
  );
};
