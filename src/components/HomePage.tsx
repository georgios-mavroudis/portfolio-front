import { HStack, Image, List, Text, VStack } from '@chakra-ui/react';
import type { FC } from 'react';
import png from '@/assets/profile.png';
import { useTranslation } from 'react-i18next';

export const HomePage: FC = () => {
  const { t } = useTranslation();
  return (
    <VStack alignItems="start" p={2}>
      <HStack width="full" justifyContent="center">
        <VStack alignItems="start" justifyContent="start" height="full">
          <Text textStyle="h2">About me</Text>
          <Text>{t('ABOUT_ME.DESCRIPTION')}</Text>
        </VStack>
        <Image src={png} width={400} rounded="md" border="md" borderColor="border.primary" />
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
