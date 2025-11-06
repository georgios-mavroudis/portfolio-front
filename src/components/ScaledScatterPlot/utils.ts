import { Mat4 } from '@/visualizations/WebGL/Mat4';
import { setColors } from './hooks';
import { DEPTH } from '../FShape/constants';

const NORMALIZE = false; // dont normalize the data
const STRIDE = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const OFFSET = 0; // start at the beginning of the buffer

export const render = ({
  gl,
  program,
  positions,
  domain,
  size,
  scale = { x: 1, y: 1, z: 1 },
  rotation = { x: 0, y: 0, z: 0 },
  translation = { x: 0, y: 0, z: 0 },
  mode = gl.POINTS,
  count = positions.length / 2,
  depth = DEPTH,
}: {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positions: Float32Array;
  size: number;
  domain?: { x: number; y: number };
  rotation?: { x: number; y: number; z: number };
  translation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  mode?: number;
  count?: number;
  depth?: number;
}) => {
  // clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // set the resolution;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Tell it to use our program
  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(positionAttributeLocation, size, gl.FLOAT, NORMALIZE, STRIDE, OFFSET);

  // Coloring
  const colorLocation = gl.getAttribLocation(program, 'a_color');

  // Create a buffer for colors.
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Put the colors in the buffer.
  setColors(gl);

  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  gl.vertexAttribPointer(colorLocation, size, gl.UNSIGNED_BYTE, true, 0, 0);

  draw({
    gl,
    count,
    program,
    translation,
    rotation,
    scale,
    domain,
    mode,
    depth,
  });
};

export const draw = ({
  gl,
  count,
  program,
  domain,
  scale = { x: 1, y: 1, z: 1 },
  rotation = { x: 0, y: 0, z: 0 },
  translation = { x: 0, y: 0, z: 0 },
  mode = gl.POINTS,
  depth = DEPTH,
}: {
  gl: WebGLRenderingContext;
  count: number;
  program: WebGLProgram;
  domain?: { x: number; y: number };
  rotation?: { x: number; y: number; z: number };
  translation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  mode?: number;
  depth?: number;
}) => {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // Resolution
  const width = gl.canvas.width;
  const height = gl.canvas.height;

  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  const domainUniformLocation = gl.getUniformLocation(program, 'u_domain');
  const translationUniformLocation = gl.getUniformLocation(program, 'u_translation');
  const scaleUniformLocation = gl.getUniformLocation(program, 'u_scale');

  if (domain) {
    gl.uniform2f(domainUniformLocation, domain.x, domain.y);
  }
  gl.uniform2f(resolutionUniformLocation, width, height);

  gl.uniform2f(translationUniformLocation, translation.x, translation.y);
  gl.uniform2f(scaleUniformLocation, scale.x, scale.y);

  // Matrix Math
  const Matrix = new Mat4();
  let matrix = Matrix.normalize(width, height, depth);
  matrix = Matrix.translate(matrix, translation.x, translation.y, translation.z);
  matrix = Matrix.rotateX(matrix, rotation.x);
  matrix = Matrix.rotateY(matrix, rotation.y);
  matrix = Matrix.rotateZ(matrix, rotation.z);
  matrix = Matrix.scale(matrix, scale.x, scale.y, scale.z);

  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.drawArrays(mode, OFFSET, count);
};

// TODO: remove
// gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// const d = 2 * HR_SAMPLE_RADIUS;
// const w = d / scaleX;
// const h = d / scaleY;
// const verticesCount = 6;
// gl.bufferData(
//   gl.ARRAY_BUFFER,
//   new Float32Array([
//     0, 0, w,
//     0, 0, h,
//     0, h, w,
//     0, w, h
//   ]),
//   gl.DYNAMIC_DRAW,
// );
// gl.enableVertexAttribArray(vertexPosAttrLoc);
// gl.vertexAttribPointer(vertexPosAttrLoc, 2, gl.FLOAT, false, 0, 0);

// // define the sample position attribute
// gl.bindBuffer(gl.ARRAY_BUFFER, sampleBuffer);
// gl.enableVertexAttribArray(samplePosAttrLoc);
// gl.vertexAttribPointer(samplePosAttrLoc, 2, gl.FLOAT, false, 0, 0);
// // this attribute only changes once per instance
// ext.vertexAttribDivisorANGLE(samplePosAttrLoc, 1);

// // draw a square for each sample instance
// ext.drawArraysInstancedANGLE(
//   gl.TRIANGLES,
//   0,
//   verticesCount,
//   samplesData.length / 2,
// );
