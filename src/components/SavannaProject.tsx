import { VStack, Text, Grid, Stack, Image, HStack, GridItem } from '@chakra-ui/react';
import type { FC } from 'react';
import savannaDemo from '@/assets/unreal_demo.mp4';
import liveLink from '@/assets/lion_live_link.mp4';
import { useTranslation } from 'react-i18next';
import IK_downward from '@/assets/IK_downward.webp';
import IK_feet from '@/assets/IK_feet.webp';
import IK_legs from '@/assets/IK_legs.webp';
import IK_upward from '@/assets/IK_upward.webp';
import canter_anim from '@/assets/canter_anim.mp4';
import gallop_anim from '@/assets/gallop_anim.mp4';
import walk_anim from '@/assets/walk_anim.mp4';
import trot_anim from '@/assets/trot_anim.mp4';
import jump_anim from '@/assets/jump_anim.mp4';

const VideoPlayer: FC<{ src: string }> = ({ src }) => (
  <video
    src={src}
    controls
    playsInline
    style={{ width: '100%', display: 'block', borderRadius: '8px' }}
  />
);

export const SavannaProject: FC = () => {
  const { t } = useTranslation();
  return (
    <VStack>
      <VStack mb="lg">
        <Text textStyle="h3">{t('SAVANNA_PROJECT.TITLE')}</Text>
        <Text>{t('SAVANNA_PROJECT.DESCRIPTION')}</Text>
        <Text textStyle="md">{t('SAVANNA_PROJECT.COMING_SOON')}</Text>
      </VStack>
      <Grid templateColumns="repeat(2, 2fr)" gap="xxl">
        {/* <VStack width="full" gap="lg" alignItems="start">
      </VStack> */}
        <VideoPlayer src={savannaDemo} />
        <Stack width="full" justifyContent="center">
          <Text textStyle="md">Gameplay Demo</Text>
        </Stack>
        {/* <HStack width="full" justifyContent="center" alignItems="center">
          Gameplay Demo
        </HStack> */}
        <Stack width="full" justifyContent="center" alignItems="end">
          <Text textStyle="md">
            Creation of ARKit's morphtargets in the lion for Live link connection with Unreal Engine
            for a smooth and realistic animation capture workflow for faster cinematics
          </Text>
        </Stack>
        <VideoPlayer src={liveLink} />
        <GridItem gridColumn="1 / -1" justifyContent="center" alignItems="center">
          <VStack width="full" justifyContent="center">
            <Stack width="full" justifyContent="center" alignItems="center">
              <Text textStyle="md">Ik on quadrupeds</Text>
            </Stack>
            <HStack width="full" justifyContent="start" alignItems="start" wrap="wrap">
              {[IK_downward, IK_feet, IK_legs, IK_upward].map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt={`IK on quadrupeds ${idx + 1}`}
                  objectFit="cover"
                  flexShrink={0}
                  loading="lazy"
                />
              ))}
            </HStack>
          </VStack>
        </GridItem>
        <GridItem gridColumn="1 / -1" justifyContent="center" alignItems="center">
          <VStack width="full" justifyContent="center">
            <Stack width="full" justifyContent="center" alignItems="center">
              <Text textStyle="md">Locomotion animations</Text>
            </Stack>
            <HStack width="full" justifyContent="start" alignItems="start" wrap="wrap">
              {[canter_anim, gallop_anim, walk_anim, trot_anim, jump_anim].map((src, idx) => (
                <video
                  key={idx}
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '30%', display: 'block', borderRadius: '8px' }}
                />
              ))}
            </HStack>
          </VStack>
        </GridItem>
      </Grid>
    </VStack>
  );
};
