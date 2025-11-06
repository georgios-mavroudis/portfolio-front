export const vertexShaderSource2D = `
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
    // Rotate
    vec2 rotatedPos = vec2(
        a_position.x * u_rotation.y + a_position.y * u_rotation.x,
        a_position.y * u_rotation.y - a_position.x * u_rotation.x);
    
    // Scale
    vec2 scaledPos = rotatedPos * u_scale; 
    
    // Multiply by the matrix.
    vec2 position = scaledPos + u_translation;

    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

export const vertexShaderSource = `
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
    // Multiply position by the matrix.
    gl_Position = u_matrix * a_position;

    // pass the color to the fragment shader
    v_color = a_color;
}
`;

export const fragmentShaderSource = `
  precision mediump float;

  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
    // gl_FragColor = vec4(1, 0, 0.5, 1);
  }
`;
