import { Image, Stack, Text, VStack } from '@chakra-ui/react';
import type { FC } from 'react';
import png from '@/assets/profile.png';
import { useTranslation } from 'react-i18next';
import { Experience } from './Experience';

export const HomePage: FC = () => {
  const { t } = useTranslation();
  return (
    <VStack alignItems="start" gap={['xxl', 'md']}>
      <Stack direction={['column', 'row']} width="full" justifyContent="center" alignItems="center">
        <Image src={png} width={300} border="md" borderColor="border.primary" borderRadius="full" />
        <VStack
          gap="md"
          alignItems={'center'}
          justifyContent={'center'}
          height="full"
          width={['full', '50%']}
        >
          <Text textStyle="h3">
            {t('ABOUT_ME.GREETING')} {` Georgios`} &#128075;
          </Text>
          <VStack width="full" justifyContent={'center'} alignItems={'center'}>
            <Text textStyle={['md', 'sm']}>{t('ABOUT_ME.DESCRIPTION')}</Text>
            <Text textStyle={['md', 'sm']}>{t('ABOUT_ME.EXTRA')}</Text>
            <Text textStyle={['md', 'sm']}>{t('ABOUT_ME.SPECIALISATION')}</Text>
          </VStack>
        </VStack>
      </Stack>
      <VStack justifyContent="center" width="full" gap="lg">
        <Text textStyle="h2" color="foreground.secondary">
          {t('EXPERIENCE')}
        </Text>
        <Experience />
      </VStack>
    </VStack>
  );
};
