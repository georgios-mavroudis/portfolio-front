import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useWebGL } from './hooks';
import { HEIGHT, MAX_Y_POINT } from './constants';
import { Box, Stack } from '@chakra-ui/react';
import { draw, render } from './utils';
import { fragmentShaderSource, vertexShaderSource } from './sources';
import { usePlot } from '@/visualizations/graph-hooks';

const ZOOM_SENSITIVITY = 0.001;

type Props = {
  data: { x: number; y: number }[];
};
export const ScatterGraph: FC<Props> = ({ data }) => {
  const { setDragging, isDragging } = usePlot();
  const [globalOffset, setGlobalOffset] = useState(0);
  const [scale, setScale] = useState(1);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0 });
  const positions = useMemo(
    () =>
      new Float32Array(data.reduce((acc, datum) => acc.concat([datum.x, datum.y]), [] as number[])),
    [data]
  );

  useEffect(() => {
    if (containerRef) {
      const { width } = containerRef.getBoundingClientRect();
      setDimensions({ width });
    }
  }, [containerRef]);

  const { attributes, gl } = useWebGL(
    canvas,
    vertexShaderSource,
    fragmentShaderSource,
    dimensions.width,
    HEIGHT
  );
  useEffect(() => {
    if (gl && attributes && attributes?.program && canvas) {
      const { program } = attributes;
      render({
        gl,
        program,
        positions,
        size: 2,
        domain: { x: data.length, y: MAX_Y_POINT },
        translation: { x: globalOffset, y: 0, z: 0 },
        scale: { x: scale, y: 1, z: 0 },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, attributes, data, gl, positions, dimensions.width]);

  useEffect(() => {
    if (gl && attributes && attributes?.program && canvas && isDragging) {
      const { program } = attributes;
      draw({
        gl,
        program,
        translation: { x: globalOffset, y: 0, z: 0 },
        count: positions.length,
        scale: { x: scale, y: 1, z: 1 },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalOffset, attributes, gl, canvas, isDragging, positions.length]);

  useEffect(() => {
    const listener = () => setDragging(false);
    window.addEventListener('mouseup', () => {
      listener();
    });
    return window.removeEventListener('mouseup', listener);
  }, [setDragging]);

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (gl && canvas && attributes) {
        const { left } = canvas.getBoundingClientRect();
        const cursor = e.clientX - left;

        const scaledCursor = (cursor - globalOffset) / scale;

        const zoomFactor = Math.exp(-e.deltaY * ZOOM_SENSITIVITY);
        const newScale = scale * zoomFactor;
        const panOffset = globalOffset + scaledCursor * (1 - zoomFactor) * scale;

        const { program } = attributes;

        draw({
          gl,
          program,
          scale: { x: newScale, y: 1, z: 1 },
          translation: { x: panOffset, y: 0, z: 0 },
          count: positions.length,
        });
        setGlobalOffset(panOffset);
        setScale(newScale);
      }
    },
    [canvas, scale, attributes, positions, gl, globalOffset]
  );

  return (
    <Stack ref={setContainerRef} position="relative" width="full" height={HEIGHT}>
      <Box
        as="canvas"
        ref={setCanvas}
        bg="graph.background"
        border="sm"
        rounded="sm"
        onMouseDown={() => setDragging(true)}
        onWheel={(e) => {
          onWheel(e);
        }}
        onMouseMove={(e) => {
          setGlobalOffset((prev) => (isDragging ? prev + e.movementX : prev));
        }}
      />
    </Stack>
  );
};
