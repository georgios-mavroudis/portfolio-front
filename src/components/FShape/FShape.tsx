import { Box, HStack, Slider, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useWebGL } from '../ScaledScatterPlot/hooks';
import { draw, render } from '../ScaledScatterPlot/utils';
import { fragmentShaderSource, vertexShaderSource } from './sources';
import { DEPTH, F_SHAPE_3D, HEIGHT, WIDTH } from './constants';
import { useTranslation } from 'react-i18next';
import { useResizeObserver } from '@/visualizations/graph-hooks';
import { useThemeBreakpointValue } from '@/design-system/tokens/breakpoints';

export const FShape = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const breakpoint = useThemeBreakpointValue();
  const height = breakpoint === 'base' ? HEIGHT / 3 : HEIGHT;

  const positions = useMemo(() => new Float32Array(F_SHAPE_3D), []);

  const [x, setX] = useState(105);
  const [y, setY] = useState(43);
  const [z, setZ] = useState(0);
  const [angleX, setAngleX] = useState(0);
  const [angleY, setAngleY] = useState(50);
  const [angleZ, setAngleZ] = useState(24);
  const [scaleX, setScaleX] = useState(0.7);
  const [scaleY, setScaleY] = useState(0.7);
  const [scaleZ, setScaleZ] = useState(1);

  const { gl, attributes } = useWebGL(canvas, vertexShaderSource, fragmentShaderSource);

  // Resize
  useEffect(() => {
    if (!gl || !canvas || !attributes) {
      return;
    }
    const { program } = attributes;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    gl.viewport(0, 0, width, height);
    render({
      gl,
      program,
      positions,
      mode: gl.TRIANGLES,
      size: 3,
      count: positions.length / 3,
      depth: DEPTH,
    });
    draw({
      gl,
      count: positions.length / 3,
      program,
      mode: gl.TRIANGLES,
      translation: { x, y, z: 0 },
      scale: { x: scaleX, y: scaleY, z: scaleZ },
      rotation: { x: angleX, y: angleY, z: angleZ },
      depth: DEPTH,
    });
  }, [width]);

  useEffect(() => {
    if (gl && attributes && attributes?.program && canvas) {
      const { program } = attributes;
      render({
        gl,
        program,
        positions,
        mode: gl.TRIANGLES,
        size: 3,
        count: positions.length / 3,
        depth: DEPTH,
      });
    }
  }, [canvas, attributes, gl, positions]);

  useEffect(() => {
    if (attributes && gl && positions) {
      const { program } = attributes;
      draw({
        gl,
        count: positions.length / 3,
        program,
        mode: gl.TRIANGLES,
        translation: { x, y, z: 0 },
        scale: { x: scaleX, y: scaleY, z: scaleZ },
        rotation: { x: angleX, y: angleY, z: angleZ },
        depth: DEPTH,
      });
    }
  }, [x, y, z, angleZ, angleX, angleY, scaleX, scaleY, scaleZ, attributes, positions, gl]);
  const { t } = useTranslation();
  return (
    <VStack alignItems="start" ref={ref}>
      <Text textStyle="h3">{t('F_SHAPE.TITLE')}</Text>
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        gap="sm"
        width="full"
        justifyContent="space-between"
      >
        <VStack alignItems="start" justifyContent={'start'} width={300}>
          {[
            { title: 'X', value: x, set: setX, min: 0, max: WIDTH },
            { title: 'Y', value: y, set: setY, min: 0, max: HEIGHT },
            { title: 'Z', value: z, set: setZ, min: 0, max: DEPTH },
            { title: 'AngleX', value: angleX, set: setAngleX, min: 0, max: 360 },
            { title: 'AngleY', value: angleY, set: setAngleY, min: 0, max: 360 },
            { title: 'AngleZ', value: angleZ, set: setAngleZ, min: 0, max: 360 },
            { title: 'ScaleX', value: scaleX, set: setScaleX, min: -5, max: 5 },
            { title: 'ScaleY', value: scaleY, set: setScaleY, min: -5, max: 5 },
            { title: 'ScaleZ', value: scaleZ, set: setScaleZ, min: -5, max: 5 },
          ].map(({ title, value, set, min, max }, i) => (
            <HStack key={i} width="100%">
              <Text>{title}</Text>
              <Slider.Root
                width={200}
                step={0.1}
                defaultValue={[value]}
                min={min}
                max={max}
                onValueChange={(valueChange) => set(valueChange.value[0])}
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                </Slider.Control>
              </Slider.Root>
              <Text width={20}>{value}</Text>
            </HStack>
          ))}
        </VStack>
        <Stack position="relative" style={{ width: '100%', height: height }}>
          <Box
            as="canvas"
            ref={setCanvas}
            bg="graph.background"
            border="sm"
            rounded="sm"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </Stack>
      </Stack>
    </VStack>
  );
};
