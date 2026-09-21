import { HStack, Image, Link, SkeletonCircle, Stack, Text, VStack } from '@chakra-ui/react';
import { useState, type FC } from 'react';
import profile from '@/assets/profile.webp';
import malt from '@/assets/malt.webp';
import linkedin from '@/assets/linkedin.webp';
import github from '@/assets/github.webp';
import { useTranslation } from 'react-i18next';
import { Experience } from './Experience';
import { Skills } from './Skills';

const EMAIL = 'georgios@smauldredd.com';

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
        <SkeletonCircle loading={!loaded} size={300} borderRadius="full" colorPalette="brand">
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
            {t('ABOUT_ME.GREETING')} {` Georgios Mavroudis`} &#128075;
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
      <VStack justifyContent="center" width="full" gap="lg" mt={100}>
        <Text textStyle="h2" color="foreground.secondary">
          {t('EXPERIENCE')}
        </Text>
        <Experience />
      </VStack>
      <VStack justifyContent="center" width="full" mt={100}>
        <Text textStyle="h2" color="foreground.secondary">
          {t('SKILLS')}
        </Text>
        <Skills />
      </VStack>
      <VStack justifyContent="center" width="full" gap="lg" mt={100}>
        <Text textStyle="h2" color="foreground.secondary">
          {t('CONTACT')}
        </Text>
        <Text textAlign="center" textStyle={{ base: 'md', sm: 'sm' }}>
          {t('ABOUT_ME.CONTACT_PREFERENCE.PREFIX')} malt
          {t('ABOUT_ME.CONTACT_PREFERENCE.SUFFIX')} <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link>
        </Text>
        <HStack gap="lg">
          <Link
            href="https://www.malt.fr/profile/georgiosmavroudis?overview"
            target="_blank"
            rel="noopener noreferrer"
            outline="none"
            _focus={{ boxShadow: 'none' }}
            _focusVisible={{ boxShadow: 'none' }}
            transition="transform 0.15s ease, filter 0.15s ease"
            _hover={{ transform: 'scale(1.1)' }}
            _active={{ filter: 'brightness(0.7)' }}
          >
            <Image src={malt} alt="Malt" width={20} height={20} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/georgios-mavroudis-ab136794/"
            target="_blank"
            rel="noopener noreferrer"
            outline="none"
            _focus={{ boxShadow: 'none' }}
            _focusVisible={{ boxShadow: 'none' }}
            transition="transform 0.15s ease, filter 0.15s ease"
            _hover={{ transform: 'scale(1.1)' }}
            _active={{ filter: 'brightness(0.7)' }}
          >
            <Image src={linkedin} alt="LinkedIn" width={20} height={20} />
          </Link>
          <Link
            href="https://github.com/georgios-mavroudis"
            target="_blank"
            rel="noopener noreferrer"
            outline="none"
            _focus={{ boxShadow: 'none' }}
            _focusVisible={{ boxShadow: 'none' }}
            transition="transform 0.15s ease, filter 0.15s ease"
            _hover={{ transform: 'scale(1.1)' }}
            _active={{ filter: 'brightness(0.7)' }}
          >
            <Image src={github} alt="GitHub" width={20} height={20} />
          </Link>
        </HStack>
      </VStack>
    </VStack>
  );
};
