import { Tooltip } from '@/design-system/components/tooltip';
import { useResizeObserver } from '@/visualizations/graph-hooks';
import { useThree } from '@/visualizations/Three';
import { Box, Button, HStack, List, Portal, Text, VStack } from '@chakra-ui/react';
import { InfoCircle, Play, Stop } from '@untitled-ui/icons-react';
import { useCallback, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

const HEIGHT = 600;

export const Heart3D = () => {
  const { ref, width, height } = useResizeObserver();
  const [hovered, setHovered] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { threeEngine } = useThree(canvas, '/heart.glb');
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
    <VStack gap="lg">
      <Box
        ref={ref}
        width="full"
        height={HEIGHT}
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
        <canvas
          ref={setCanvas}
          width={width}
          height={height}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      <HStack width="full" height={20} alignItems="center">
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
    </VStack>
  );
};
