import { PlotProvider } from '@/visualizations/components/PlotContext';
import { HeartbeatGraph } from './Graph';

export const HeartBeatAnalysis = () => {
  return (
    <PlotProvider>
      <HeartbeatGraph />
    </PlotProvider>
  );
};
