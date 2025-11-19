import { useResizeObserver } from '@/visualizations/graph-hooks';
import { useThree } from '@/visualizations/Three';
import { Box, HStack, List, Portal, Text, VStack } from '@chakra-ui/react';
import { InfoCircle } from '@untitled-ui/icons-react';
import { useCallback, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

const HEIGHT = 600;

export const Heart3D = () => {
  const { ref, width, height } = useResizeObserver();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { threeEngine } = useThree(canvas, '/heart.glb');
  const { t } = useTranslation();

  const mouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const x = e.movementX;
      const y = e.movementY;
      if (e.shiftKey) {
        threeEngine.current?.rotateLight(x, y);
      } else if (dragging) {
        threeEngine.current?.animate();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dragging]
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
            setDragging(true);
            threeEngine.current.controls.enablePan = true;
            threeEngine.current.setIsAnimating(true);
          }
        }}
        onMouseMove={mouseMove}
        onMouseUp={() => {
          if (threeEngine.current) {
            setDragging(false);
            threeEngine.current.controls.enablePan = false;
            threeEngine.current.setIsAnimating(false);
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
      <HStack width="full" height={20} alignItems="start" ref={portalRef}>
        <InfoCircle onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} />
        {hovered && (
          <Portal container={portalRef}>
            <Box
              bg="background.secondary"
              p="md"
              rounded="lg"
              border="sm"
              borderColor="border.secondary"
              opacity={0.9}
              style={{ transform: 'translateY(-80px)' }}
            >
              <Text textStyle="title">{t('HEART_3D.TITLE')}</Text>
              <List.Root ps="5">
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
