import { IconButton, VStack, Text, HStack } from '@chakra-ui/react';
import { PauseCircle, Play, Stop } from '@untitled-ui/icons-react';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import savannaDemo from '@/assets/unreal_demo.mp4';
import { useTranslation } from 'react-i18next';

const VideoPlayer: FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  const pause = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  return (
    <VStack position="relative" width="full" gap="sm" alignItems="center">
      <video
        ref={videoRef}
        src={src}
        playsInline
        onEnded={() => setPlaying(false)}
        style={{ width: '50%', display: 'block', borderRadius: '8px' }}
      />
      <HStack
        gap="sm"
        position="absolute"
        bottom="10px"
        left="50%"
        bg="rgba(0, 0, 0, 0.5)"
        p="2"
        borderRadius="md"
      >
        {playing ? (
          <IconButton aria-label="Pause" variant="outline" size="sm" onClick={pause}>
            <PauseCircle />
          </IconButton>
        ) : (
          <IconButton aria-label="Play" variant="outline" size="sm" onClick={play}>
            <Play />
          </IconButton>
        )}
        <IconButton aria-label="Stop" variant="outline" size="sm" onClick={stop}>
          <Stop />
        </IconButton>
      </HStack>
    </VStack>
  );
};

export const SavannaProject: FC = () => {
  const { t } = useTranslation();
  return (
    <VStack width="full" gap="lg" alignItems="start">
      <Text textStyle="h3">{t('SAVANNA_PROJECT.TITLE')}</Text>
      <Text>{t('SAVANNA_PROJECT.DESCRIPTION')}</Text>
      <VideoPlayer src={savannaDemo} />
      <HStack width="full" justifyContent="center" alignItems="center">
        <Text textStyle="md" color="disabled">
          {t('SAVANNA_PROJECT.COMING_SOON')}
        </Text>
      </HStack>
    </VStack>
  );
};
