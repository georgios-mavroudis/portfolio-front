import { Box, HStack, Progress, Text, VStack } from '@chakra-ui/react';
import { KeyboardControls, type KeyboardControlsEntry, useProgress } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Game } from './Game';
import { useResizeObserver } from '@/visualizations/graph-hooks';
import { useTranslation } from 'react-i18next';
import { CONTROLS } from './utils';
import { ArrowDown, ArrowUp } from '@untitled-ui/icons-react';

const keyboardMap: KeyboardControlsEntry<string>[] = [
  { name: CONTROLS.jump, keys: ['ArrowUp', 'Space'] },
  { name: CONTROLS.crouch, keys: ['ArrowDown', 'KeyC', 'ControlLeft'] },
];

const GameLoader = () => {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active || progress > 0) setVisible(true);
  }, [active, progress]);

  useEffect(() => {
    if (!active && progress === 100) {
      const id = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(id);
    }
  }, [active, progress]);

  if (!visible) return null;
  return (
    <Box
      position="absolute"
      inset={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.canvas"
      rounded="md"
      zIndex={1}
    >
      <Progress.Root width="60%" value={progress} max={100} striped animated>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </Box>
  );
};

export const GameContainer = () => {
  const { ref, width, height } = useResizeObserver();
  const { t } = useTranslation();
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const scoreDisplayRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isGameOver) return;
    const handleKey = () => {
      setIsGameOver(false);
      setGameKey((k) => k + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isGameOver]);

  useEffect(() => {
    setGameKey((k) => k + 1);
  }, [width, height]);
  return (
    <Box
      ref={ref}
      position="relative"
      width="full"
      height={600}
      rounded="md"
      border="md"
      borderColor="border.primary"
    >
      <GameLoader />
      <KeyboardControls map={keyboardMap}>
        <Canvas
          fallback={<Text>{t('GAME.NOT_SUPPORTED')}</Text>}
          shadows
          frameloop={isGameOver ? 'never' : 'always'}
        >
          <Suspense fallback={null}>
            <Game
              key={gameKey}
              width={width}
              height={height}
              onGameOver={() => setIsGameOver(true)}
              scoreDisplayRef={scoreDisplayRef}
            />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      {isGameOver && (
        <VStack
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="blackAlpha.700"
        >
          <Text color="white" textStyle="h3">
            {t('GAME.GAME_OVER')}
          </Text>
          <Text color="white" textStyle="title">
            {t('GAME.SCORE')}: {scoreDisplayRef.current?.textContent}
          </Text>
          <Text color="white" textStyle="body">
            {t('GAME.PRESS_TO_RESTART')}
          </Text>
        </VStack>
      )}
      <Text ref={scoreDisplayRef} position="absolute" top={8} right={16}>
        Score: {scoreDisplayRef.current?.textContent ?? '00000'}
      </Text>
      <VStack alignItems={'start'} gap="xs" m="md">
        <HStack>
          <Text textStyle="md">{t('GAME.JUMP')}: </Text>
          <Text textStyle="md">{t('GAME.ARROW')}</Text>
          <ArrowUp />
        </HStack>
        <HStack>
          <Text textStyle="md">{t('GAME.CROUCH')}: </Text>
          <Text textStyle="md">{t('GAME.ARROW')}</Text>
          <ArrowDown />
        </HStack>
      </VStack>
    </Box>
  );
};
