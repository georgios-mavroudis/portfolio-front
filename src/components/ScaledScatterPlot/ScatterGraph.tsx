import { type FC, useCallback, useEffect, useState } from 'react';
import { useWebGL } from './hooks';
import { HEIGHT, MAX_Y_POINT } from './constants';
import { Box, Stack } from '@chakra-ui/react';
import { draw, render } from './utils';
import { fragmentShaderSource, vertexShaderSource } from './sources';
import { usePlot, useResizeObserver } from '@/visualizations/graph-hooks';
import { pointer } from 'd3';

const ZOOM_SENSITIVITY = 0.001;

type Props = {
  positions: Float32Array<ArrayBuffer>;
};
export const ScatterGraph: FC<Props> = ({ positions }) => {
  const { setDragging, isDragging } = usePlot();
  const [globalOffset, setGlobalOffset] = useState(0);
  const [scale, setScale] = useState(1);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();
  const { attributes, gl } = useWebGL(canvas, vertexShaderSource, fragmentShaderSource);

  // Resize canvas
  useEffect(() => {
    if (!canvas || !gl || !attributes) {
      return;
    }
    const { program } = attributes;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(width * dpr, 1);
    canvas.height = Math.max(height * dpr, 1);
    gl.viewport(0, 0, canvas.width, canvas.height);

    render({
      gl,
      program,
      positions,
      size: 2,
      domain: { x: positions.length / 2, y: MAX_Y_POINT },
      translation: { x: globalOffset, y: 0, z: 0 },
      scale: { x: scale, y: 1, z: 0 },
    });
  }, [width]);

  useEffect(() => {
    if (gl && attributes && attributes?.program && canvas) {
      const { program } = attributes;
      render({
        gl,
        program,
        positions,
        size: 2,
        domain: { x: positions.length / 2, y: MAX_Y_POINT },
        translation: { x: globalOffset, y: 0, z: 0 },
        scale: { x: scale, y: 1, z: 0 },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, gl, positions]);

  useEffect(() => {
    if (gl && attributes && attributes?.program && canvas && isDragging) {
      const { program } = attributes;
      draw({
        gl,
        program,
        translation: { x: globalOffset, y: 0, z: 0 },
        count: positions.length / 2,
        scale: { x: scale, y: 1, z: 1 },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalOffset, attributes, gl, isDragging, positions.length]);

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
        const [cursor] = pointer(e);
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
          count: positions.length / 2,
        });
        setGlobalOffset(panOffset);
        setScale(newScale);
      }
    },
    [canvas, scale, attributes, positions, gl, globalOffset]
  );

  return (
    <Stack ref={ref} style={{ width: '100%', height: HEIGHT }}>
      <Box
        as="canvas"
        ref={setCanvas}
        border="sm"
        rounded="sm"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
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
