export class Mat3 {
  translate = (m: number[], tx: number, ty: number) => this.multiply(m, this.translation(tx, ty));

  rotate = (m: number[], angleInDegrees: number) => this.multiply(m, this.rotation(angleInDegrees));

  scale = (m: number[], sx: number, sy: number) => this.multiply(m, this.scaling(sx, sy));

  normalize(width: number, height: number) {
    const sx = 2 / width;
    const sy = 2 / height;
    // prettier-ignore
    return [
      sx, 0, 0,
      0, -sy, 0,
      -1, 1, 1,
    ]
  }

  private translation(tx: number, ty: number) {
    // prettier-ignore
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ]
  }

  private rotation(angleInDegrees: number) {
    const angleInRad = (angleInDegrees * Math.PI) / 180;
    const s = Math.sin(angleInRad);
    const c = Math.cos(angleInRad);
    // prettier-ignore
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1
    ]
  }

  private scaling(sx: number, sy: number) {
    // prettier-ignore
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ]
  }

  private multiply(a: number[], b: number[]) {
    // prettier-ignore
    const a00 = a[0], a01 = a[1], a02 = a[2];
    // prettier-ignore
    const a10 = a[3], a11 = a[4], a12 = a[5];
    // prettier-ignore
    const a20 = a[6], a21 = a[7], a22 = a[8];

    // prettier-ignore
    const b00 = b[0], b01 = b[1], b02 = b[2];
    // prettier-ignore
    const b10 = b[3], b11 = b[4], b12 = b[5];
    // prettier-ignore
    const b20 = b[6], b21 = b[7], b22 = b[8];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  }
}
