import type { HeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';
import type { Dimensions } from '@/visualizations/components/PlotContext';

const SQUARE_SIZE = 30; // px

export const SECOND = 1000; // ms

export const GRID_UNIT_SIZE = SQUARE_SIZE / 25; // px - the width of a grid line => 1/25 of a square

export const squareToPixel = (squares: number) => squares * SQUARE_SIZE;

export const GRID_MS = 200; // ms

export const GRID_MV = 0.5; // mV

export const MV_HEIGHT = 2 * GRID_MV;

export function calculateHeartBeat(
  startIdx: number,
  endIdx: number,
  QRSs: HeartbeatData['annotations']['QRS'],
  frequency: number
) {
  const displayedQRSs = QRSs.filter((rr) => startIdx <= rr && rr <= endIdx);
  // We calculate all the visible RRs (distance between neighboring QRSs)
  // we ignore the first QRS since we cannot calculate its RR from the previous QRS
  const RRs = [];
  for (let i = 1; i < displayedQRSs.length; i++) {
    RRs.push(displayedQRSs[i] - displayedQRSs[i - 1]);
  }

  if (RRs.length === 0) {
    return null;
  }
  const averageRR = RRs.reduce((acc, rr) => acc + rr, 0) / RRs.length;
  // formula for bpm: 60 x fs / RR interval (in samples)
  return Math.round((60 * frequency) / averageRR);
}

export const getGridLength = (frequency: number) => (frequency * GRID_MS) / SECOND;

// one square box grid = 0.5mV / 200ms for 360 frequency we have 1 s --> 360 fiducial points
// so 200ms --> 360 * .2s = 72 points (=grid time).
// On the y axis we want to display a height of 2mV [-1mV, 1mV(=MV_HEIGHT)] --> 4 boxes * 0.5mV
// height --> 4 boxes, width --> ? boxes
// boxes in x axis --> (width / height) * 4
// ex. width = 980, height = 220: (980 / 220) * 4 = 17.8182 boxes
// to ms: 17.8182 * grid time (=72) --> 1282.91 points
export const getViewerLength = (frequency: number, dimensions: Dimensions) => {
  const { width, height } = dimensions;
  return ((width * 4) / height) * getGridLength(frequency);
};

export const fiducialDatumToTime = (datum: number, frequency: number) =>
  (datum * SECOND) / frequency;
