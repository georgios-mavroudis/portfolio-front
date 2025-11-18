import { HStack, Image, Text, VStack } from '@chakra-ui/react';
import type { FC } from 'react';
import png from '@/assets/profile.png';
import { useTranslation } from 'react-i18next';
import { Experience } from './Experience';

export const HomePage: FC = () => {
  const { t } = useTranslation();
  return (
    <VStack alignItems="start" gap="xxl">
      <HStack width="full" justifyContent="center">
        <VStack alignItems="start" justifyContent="start" height="full" width="50%">
          <Text textStyle="h1">GEORGIOS MAVROUDIS</Text>
          <Text>{t('ABOUT_ME.DESCRIPTION')}</Text>
          <Text>{t('ABOUT_ME.EXTRA')}</Text>
        </VStack>
        <Image src={png} width={400} rounded="md" border="md" borderColor="border.primary" />
      </HStack>
      <VStack justifyContent="center" width="full" gap="lg">
        <Text textStyle="h2">{t('EXPERIENCE')}</Text>
        <Experience />
      </VStack>
    </VStack>
  );
};
