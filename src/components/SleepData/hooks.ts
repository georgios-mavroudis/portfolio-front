import type { Data } from '@/types/sleep-data-types';
import { usePlot } from '@/visualizations/graph-hooks';

// Tooltip
export const useFindHoveredDatum = (data: Data[]) => {
  const { dateScale } = usePlot();

  return (mouseX: number | null) => {
    if (mouseX == null) {
      return null;
    }

    const hoveredDatum = data.find(
      ({ wakeTime, bedTime }) =>
        wakeTime && bedTime && mouseX > dateScale(bedTime) && mouseX < dateScale(wakeTime)
    );

    if (hoveredDatum == null) {
      return null;
    }
    return hoveredDatum;
  };
};
