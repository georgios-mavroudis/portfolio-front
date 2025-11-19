import { useResizeObserver } from '@/visualizations/graph-hooks';
import { useThree } from '@/visualizations/Three';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { InfoCircle } from '@untitled-ui/icons-react';
import { useCallback, useRef, useState, type MouseEvent } from 'react';

const HEIGHT = 600;

export const Heart3D = () => {
  const { ref, width, height } = useResizeObserver();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const portal = useRef<SVGSVGElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { threeEngine } = useThree(canvas, '/heart.glb');

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
      <HStack width="full" alignItems="start">
        <InfoCircle
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(true)}
          ref={portal}
        />
        {hovered && (
          <Box>
            <Text></Text>
          </Box>
        )}
      </HStack>
    </VStack>
  );
};
