import { useMemo } from 'react';
import { COLOR_DATA } from '../FShape/constants';

export const useWebGL = (
  canvas: HTMLCanvasElement | null,
  vertexShaderSource: string,
  fragmentShaderSource: string
) => {
  const gl = canvas?.getContext('webgl');
  const attributes = useMemo(
    () => (gl ? initiate(gl, vertexShaderSource, fragmentShaderSource) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gl]
  );
  return { gl, attributes };
};

export const initiate = (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) {
    return;
  }

  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) {
    return;
  }

  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) {
    return;
  }
  // Bind the buffer position
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  return {
    program,
  };
};

const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);

  if (!shader) {
    return;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }
  gl.deleteShader(shader);
};

const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram();
  if (!program) {
    return;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  } else {
    gl.deleteProgram(program);
  }
};

export const setCanvasResolution = (
  canvas: HTMLCanvasElement | null,
  width: number,
  height: number
) => {
  if (canvas) {
    const dpr = window.devicePixelRatio || 1;

    // desired CSS size (design-system units)
    const cssW = width;
    const cssH = height;

    // set drawing buffer resolution
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    // set CSS size so layout stays the same
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
  }
};

export const setColors = (gl: WebGLRenderingContext) => {
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(COLOR_DATA), gl.STATIC_DRAW);
};
