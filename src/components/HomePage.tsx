import { Image, SkeletonCircle, Stack, Text, VStack } from '@chakra-ui/react';
import { useState, type FC } from 'react';
import profile from '@/assets/profile.webp';
import { useTranslation } from 'react-i18next';
import { Experience } from './Experience';

export const HomePage: FC = () => {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  return (
    <VStack alignItems="start" gap={{ base: 'xxl', sm: 'md' }}>
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        width="full"
        justifyContent="center"
        alignItems="center"
      >
        <SkeletonCircle loading={!loaded} borderRadius="full" colorPalette="brand">
          <Image
            src={profile}
            alt="Profile pic"
            width={300}
            borderRadius="full"
            onLoad={() => setLoaded(true)}
          />
        </SkeletonCircle>
        <VStack
          gap="md"
          alignItems={'center'}
          justifyContent={'center'}
          height="full"
          width={{ base: 'full', sm: '50%' }}
        >
          <Text textStyle="h3">
            {t('ABOUT_ME.GREETING')} {` Georgios`} &#128075;
          </Text>
          <VStack width="full" justifyContent={'center'} alignItems={'center'}>
            <Text textAlign="center" textStyle={{ base: 'md', sm: 'sm' }}>
              {t('ABOUT_ME.DESCRIPTION')}
            </Text>
            <Text textAlign="center" textStyle={{ base: 'md', sm: 'sm' }}>
              {t('ABOUT_ME.EXTRA')}
            </Text>
            <Text textAlign="center" textStyle={{ base: 'md', sm: 'sm' }}>
              {t('ABOUT_ME.SPECIALISATION')}
            </Text>
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
