import type { ScaleLinear } from 'd3-scale';

export const drawBeat = ({
  xScale,
  yScale,
  canvasWidth,
  canvasHeight,
  beatStripEl,
  beat,
  color,
  offsetY = 0,
}: {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  canvasWidth: number;
  canvasHeight: number;
  beatStripEl: HTMLCanvasElement;
  beat: number[];
  offsetY?: number;
  color: string;
}) => {
  const beatStripCtx = beatStripEl.getContext('2d');
  const ratio = window.devicePixelRatio || 1;

  if (beatStripEl != null && beatStripCtx != null) {
    setUpPixelRatio(canvasWidth, canvasHeight, beatStripEl, beatStripCtx, ratio);
    beatStripCtx.beginPath();
    beatStripCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    beatStripCtx.strokeStyle = color;
    beat.forEach((point, idx) => {
      drawPath(beatStripCtx, xScale, yScale, idx, point, offsetY);
    });
    beatStripCtx.stroke();
  }
};

const drawPath = (
  ctx: CanvasRenderingContext2D,
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
  x: number,
  y: number | null,
  offsetY = 0
) => {
  if (y == null) {
    return;
  }
  const scaledX = roundPixel(xScale(x));
  const scaledY = roundPixel(yScale(y) + offsetY);
  if (x === 0) {
    ctx.moveTo(scaledX, scaledY);
  } else {
    ctx.lineTo(scaledX, scaledY);
  }
};

const setUpPixelRatio = (
  width: number,
  height: number,
  canvasElement: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  ratio: number
) => {
  canvasElement.style.width = `${width}px`;
  canvasElement.style.height = `${height}px`;

  canvasElement.width = Math.floor(width * ratio);
  canvasElement.height = Math.floor(height * ratio);
  canvasCtx.scale(ratio, ratio);
};

const roundPixel = (x: number) => Math.round(x * 100) / 100;
