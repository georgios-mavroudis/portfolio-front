export class Mat4 {
  translate = (m: number[], tx: number, ty: number, tz: number) =>
    this.multiply(m, this.translation(tx, ty, tz));

  rotateX = (m: number[], angleInDegrees: number) =>
    this.multiply(m, this.xRotation(angleInDegrees));

  rotateY = (m: number[], angleInDegrees: number) =>
    this.multiply(m, this.yRotation(angleInDegrees));

  rotateZ = (m: number[], angleInDegrees: number) =>
    this.multiply(m, this.zRotation(angleInDegrees));

  scale = (m: number[], sx: number, sy: number, sz: number) =>
    this.multiply(m, this.scaling(sx, sy, sz));

  normalize(width: number, height: number, depth: number) {
    const nx = 2 / width;
    const ny = 2 / height;
    const nz = 2 / depth;
    // prettier-ignore
    return [
      nx,   0,  0,  0,
       0, -ny,  0,  0,
       0,   0, nz,  0, 
      -1,   1,  0,  1,
    ]
  }

  private translation(tx: number, ty: number, tz: number) {
    // prettier-ignore
    return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1,
    ]
  }

  private xRotation(angleInDegrees: number) {
    const angleInRad = (angleInDegrees * Math.PI) / 180;
    const s = Math.sin(angleInRad);
    const c = Math.cos(angleInRad);
    // prettier-ignore
    return [
      1,  0,  0,  0,
      0,  c, -s,  0,
      0,  s,  c,  0,
      0,  0,  0,  1,
    ]
  }
  private yRotation(angleInDegrees: number) {
    const angleInRad = (angleInDegrees * Math.PI) / 180;
    const s = Math.sin(angleInRad);
    const c = Math.cos(angleInRad);
    // prettier-ignore
    return [
      c,  0, -s,  0,
      0,  1,  0,  0,
      s,  0,  c,  0,
      0,  0,  0,  1,
    ]
  }
  private zRotation(angleInDegrees: number) {
    const angleInRad = (angleInDegrees * Math.PI) / 180;
    const s = Math.sin(angleInRad);
    const c = Math.cos(angleInRad);
    // prettier-ignore
    return [
       c, -s,  0,  0,
       s,  c,  0,  0,
       0,  0,  1,  0,
       0,  0,  0,  1,
    ]
  }

  private scaling(sx: number, sy: number, sz: number) {
    // prettier-ignore
    return [
      sx,  0,  0,  0,
      0,  sy,  0,  0,
      0,   0, sz,  0,
      0,   0,  0,  1,
    ]
  }

  private multiply(a: number[], b: number[]) {
    // prettier-ignore
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    // prettier-ignore
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    // prettier-ignore
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    // prettier-ignore
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // prettier-ignore
    const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
    // prettier-ignore
    const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
    // prettier-ignore
    const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
    // prettier-ignore
    const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  }
}
