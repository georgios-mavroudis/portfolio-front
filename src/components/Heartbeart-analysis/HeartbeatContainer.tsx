import type { HeartbeatData } from '@/queries/heartbeat-analysis/heartbeat-analysis.queries';
import type { FC } from 'react';

type Props = {
  data: HeartbeatData;
  children: ({ data }: { data: HeartbeatData }) => void;
};
export const HeartbeatContainer: FC<Props> = ({ data, children }) => {
  return <>{children({ data })}</>;
};
