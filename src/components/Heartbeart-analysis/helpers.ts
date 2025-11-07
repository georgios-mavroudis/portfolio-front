import type { HeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';

const SQUARE_SIZE = 30; // px

export const GRID_UNIT_SIZE = SQUARE_SIZE / 25; // px - the width of a grid line => 1/25 of a square

export const squareToPixel = (squares: number) => squares * SQUARE_SIZE;

export const GRID_MS = 200; // ms

export const GRID_MV = 0.5; // mV

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
    return 0;
  }
  //   console.log(QRSs, displayedQRSs);
  const averageRR = RRs.reduce((acc, rr) => acc + rr, 0) / RRs.length;
  // formula for bpm: 60 x fs / RR interval (in samples)
  return Math.round((60 * frequency) / averageRR);
}
