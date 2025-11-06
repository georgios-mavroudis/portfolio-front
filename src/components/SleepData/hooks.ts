import type { Data } from '@/types/sleep-data-types';
import { type PlotData } from '@/visualizations/components/PlotContext';
import { createContext, useContext } from 'react';

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

export const PlotContext = createContext<PlotData | null>(null);

export const usePlot = () => {
  const context = useContext<PlotData | null>(PlotContext);
  if (context === null) {
    throw new Error('usePlot must be inside <PlotContext />');
  }

  return context;
};
