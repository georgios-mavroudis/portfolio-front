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
        <VStack gap="md" alignItems="start" justifyContent="start" height="full" width="50%">
          <Text textStyle="h3">
            {t('ABOUT_ME.GREETING')} {` Georgios`} &#128075;
          </Text>
          <Text>{t('ABOUT_ME.DESCRIPTION')}</Text>
          <Text>{t('ABOUT_ME.EXTRA')}</Text>
          <Text>{t('ABOUT_ME.SPECIALISATION')}</Text>
          <VStack></VStack>
        </VStack>
        <Image src={png} width={300} border="md" borderColor="border.primary" borderRadius="full" />
      </HStack>
      <VStack justifyContent="center" width="full" gap="lg">
        <Text textStyle="h2" color="foreground.secondary">
          {t('EXPERIENCE')}
        </Text>
        <Experience />
      </VStack>
    </VStack>
  );
};
