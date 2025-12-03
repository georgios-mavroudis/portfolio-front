import { Tooltip } from '@/design-system/components/tooltip';
import { useThemeBreakpointValue } from '@/design-system/tokens/breakpoints';
import { useThree } from '@/visualizations/three/Three';
import { Box, Button, HStack, List, Portal, Text, VStack } from '@chakra-ui/react';
import { InfoCircle, Play, Stop } from '@untitled-ui/icons-react';
import { useCallback, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

const HEIGHT = 600;

export const Heart3D = () => {
  const [hovered, setHovered] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { threeEngine } = useThree(canvas, '/heart.glb');
  const breakpoint = useThemeBreakpointValue();
  const height = useMemo(() => (breakpoint === 'base' ? HEIGHT / 3 : HEIGHT), [breakpoint]);

  const { t } = useTranslation();
  const [togglePlay, setTogglePlay] = useState(true);
  const playAnimation = useCallback(() => {
    const engine = threeEngine.current;
    if (!engine) {
      return;
    }
    if (togglePlay) {
      setTogglePlay(false);
      return engine.setIsAnimating(false);
    }
    setTogglePlay(true);
    engine.setIsAnimating(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [togglePlay]);

  const mouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const x = e.movementX;
      const y = e.movementY;
      if (e.shiftKey) {
        threeEngine.current?.rotateLight(x, y);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <VStack gap="lg" width="full">
      <HStack width="full" alignItems="center">
        <Button variant="outline" size="sm" onClick={playAnimation} mr={2}>
          <Tooltip
            content={togglePlay ? t('HEART_3D.PAUSE_ANIMATION') : t('HEART_3D.PLAY_ANIMATION')}
          >
            {togglePlay ? <Stop /> : <Play />}
          </Tooltip>
        </Button>
        <Box ref={portalRef}>
          <InfoCircle
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          />
        </Box>
        {hovered && (
          <Portal container={portalRef}>
            <Box
              bg="background.secondary"
              p="md"
              rounded="lg"
              border="sm"
              borderColor="border.secondary"
              opacity={0.9}
              position="absolute"
              style={{ transform: 'translate(30px ,-80px)' }}
              zIndex={1}
            >
              <Text textStyle="title">{t('HEART_3D.CONFIGURATIONS_TITLE')}</Text>
              <List.Root ps="5" variant="marker">
                <List.Item>{t('HEART_3D.KEYS_CONFIGURATION.ROTATE')}</List.Item>
                <List.Item>{t('HEART_3D.KEYS_CONFIGURATION.ZOOM')}</List.Item>
                <List.Item>{t('HEART_3D.KEYS_CONFIGURATION.ROTATE_LIGHT')}</List.Item>
              </List.Root>
            </Box>
          </Portal>
        )}
      </HStack>
      <Box
        style={{ width: '100%', height: height }}
        rounded="md"
        border="md"
        borderColor="border.primary"
        position="relative"
        onMouseDown={() => {
          if (threeEngine.current) {
            threeEngine.current.controls.enablePan = true;
          }
        }}
        onMouseMove={mouseMove}
        onMouseUp={() => {
          if (threeEngine.current) {
            threeEngine.current.controls.enablePan = false;
          }
        }}
      >
        <canvas ref={setCanvas} style={{ width: '100%', height: '100%', display: 'block' }} />
      </Box>
    </VStack>
  );
};
