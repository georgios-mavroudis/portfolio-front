import type { HeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';
import { GRID_HEIGHT } from '@/visualizations/constants';
import { usePlot } from '@/visualizations/graph-hooks';
import { useEffect, type FC } from 'react';

type Props = {
  data: HeartbeatData;
  children: ({ data }: { data: HeartbeatData }) => void;
  width: number;
};
export const HeartbeatContainer: FC<Props> = ({ data, children, width }) => {
  const { setDimensions } = usePlot();
  useEffect(() => {
    setDimensions({ height: GRID_HEIGHT * 2, width });
  }, [width]);
  return <>{children({ data })}</>;
};
