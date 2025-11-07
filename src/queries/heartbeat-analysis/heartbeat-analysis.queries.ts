import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIME_FIVE_MINUTES } from '../query-config';
// import { useFetch } from '../helpers';
// import { fetchData } from '../stock-data/stock-data-queries';
import json from '../../components/Heartbeart-analysis/data.json'; // TODO: change with data from server

type ApiData = {
  frequency: number;
  leads: Record<string, number[]>;
  samples: number;
  lead_names: string[];
  units: string[];
  file_name: string;
  annotations: {
    QRS: number[];
    symbol: string[];
  };
};

export type HeartbeatData = {
  frequency: number;
  leads: Record<string, number[]>;
  samples: number;
  leadNames: string[];
  fileName: string;
  annotations: {
    QRS: number[];
    symbol: string[];
  };
};
export const useHeartbeatData = () => {
  //   const fetch = useFetch();

  return useQuery({
    queryKey: [QUERY_KEYS.heartbeatEcg],
    queryFn: () => buildData(json as unknown as ApiData),
    retry: 0,
    staleTime: STALE_TIME_FIVE_MINUTES,
  });
};

export const buildData = (response: ApiData): HeartbeatData => {
  const { leads, frequency, annotations, samples, lead_names, file_name } = response;
  return {
    leads,
    frequency,
    annotations,
    samples,
    leadNames: lead_names,
    fileName: file_name,
  };
};
