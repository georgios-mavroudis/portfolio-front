import { Box, HStack, Slider, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useWebGL } from '../ScaledScatterPlot/hooks';
import { draw, render } from '../ScaledScatterPlot/utils';
import { fragmentShaderSource, vertexShaderSource } from './sources';
import { DEPTH, F_SHAPE_3D, HEIGHT, WIDTH } from './constants';

export const FShape = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  // prettier-ignore
  const positions = useMemo(
    () =>
      new Float32Array(F_SHAPE_3D),
    []
  );

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [angleX, setAngleX] = useState(0);
  const [angleY, setAngleY] = useState(0);
  const [angleZ, setAngleZ] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [scaleZ, setScaleZ] = useState(1);

  const { gl, attributes } = useWebGL(
    canvas,
    vertexShaderSource,
    fragmentShaderSource,
    WIDTH,
    HEIGHT
  );

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

  return (
    <VStack alignItems="start">
      <Text>WEBGL Scatter Plot</Text>
      <HStack width="full" justifyContent="space-between">
        <VStack alignItems="start" height={HEIGHT} justifyContent={'start'}>
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
            <HStack key={i}>
              <Text>{title}</Text>
              <Slider.Root
                width={200}
                step={0.1}
                defaultValue={[1]}
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
              <Text>{value}</Text>
            </HStack>
          ))}
        </VStack>
        <Stack position="relative" width={WIDTH} height={HEIGHT}>
          <Box as="canvas" ref={setCanvas} bg="graph.background" border="sm" rounded="sm" />
        </Stack>
      </HStack>
    </VStack>
  );
};
