import { QUERY_KEYS, STALE_TIME_FIVE_MINUTES } from '../query-config';
import { API } from '../api.model';
import { useQuery } from '@tanstack/react-query';
import {
  APPLE,
  TIME_SERIES_DAILY,
  type CompanySymbol,
  type OutputSize,
  type StockApiData,
  type StockData,
  type StockDataFrequency,
} from './model';
import { useFetch, type Fetch } from '../helpers';

export const useStockData = (
  frequency: StockDataFrequency = TIME_SERIES_DAILY,
  companySymbol: CompanySymbol = APPLE,
  outputSize: OutputSize = 'compact'
) => {
  const fetch = useFetch();
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

  return useQuery({
    queryKey: [QUERY_KEYS.stockData],
    queryFn: fetchData(fetch, apiKey, frequency, companySymbol, outputSize),
    retry: 0,
    staleTime: STALE_TIME_FIVE_MINUTES,
    // enabled: ,
  });
};

export const fetchData =
  (
    fetch: Fetch<StockData[]>,
    apiKey: string,
    frequency: StockDataFrequency,
    companySymbol: CompanySymbol,
    outputSize: OutputSize
  ) =>
  async () => {
    const url = API.STOCK_DATA.GET.DATA(apiKey, frequency, companySymbol, outputSize);
    const response = await fetch(url);

    return buildData(response);
  };

export const buildData = (response: StockApiData[]): StockData[] => {
  console.log(response);
  return []; //response.map((datum) => ({}));
};
