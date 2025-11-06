export const vertexShaderSource = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;
  uniform vec2 u_domain;
  uniform vec2 u_translation;
  uniform vec2 u_scale;

  void main() {
    // normalize the data from their domain to the canvas pixel range   
    vec2 scaledPos = a_position * u_resolution / u_domain;
    
    // invert the y axis coordinates so 
    vec2 reversedYPos = vec2(scaledPos.x, u_resolution.y - scaledPos.y);
    
    // zoom and pan
    vec2 zoomAndPan = reversedYPos * u_scale + u_translation;
    
    // convert the positions from pixels to the range [0.0, 1.0]
    vec2 zeroToOne = zoomAndPan / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->1
    vec2 clipSpace = vec2(zeroToTwo - 1.0);
    gl_PointSize = 10.0; // size of the vertex drawn
    gl_Position = vec4(clipSpace, 0, 1);
  }
`;

export const fragmentShaderSource = `
  precision mediump float;

  void main() {
    vec2 pointCoord = gl_PointCoord - vec2(0.5); // Normalized coordinates (0,0 to 1,1 -> centered at (0.5,0.5))
    float dist = length(pointCoord); // get euclidean distance of fragment from pointCoord

    if (dist > 0.5) {
      // If the distance is greater than 0.5 (radius), discard the fragment
      discard;
    } else if (dist > 0.24) {
      // draw black
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
      // draw red
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  }
`;
