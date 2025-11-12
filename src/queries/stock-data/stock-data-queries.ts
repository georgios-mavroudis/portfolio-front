import { QUERY_KEYS, STALE_TIME_FIVE_MINUTES } from '../query-config';
import { API } from '../api.model';
import { useQuery } from '@tanstack/react-query';
import { APPLE, type CompanySymbol, type StockApiData, type StockData } from './model';
import { useFetch, type Fetch } from '../helpers';

export const useStockData = (companySymbol: CompanySymbol = APPLE) => {
  const fetch = useFetch();
  // const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  const apiKey = import.meta.env.VITE_FINANCIAL_MODELING_PREP_API_KEY;

  return useQuery({
    queryKey: [QUERY_KEYS.stockData, companySymbol],
    queryFn: fetchData(fetch, apiKey, companySymbol),
    retry: 0,
    staleTime: STALE_TIME_FIVE_MINUTES,
    // enabled: ,
  });
};

export const fetchData =
  (fetch: Fetch<StockApiData[]>, apiKey: string, companySymbol: CompanySymbol) => async () => {
    const url = API.STOCK_DATA.GET.DATA(companySymbol, apiKey);
    const response = await fetch(url);

    return buildData(response);
  };

export const buildData = (response: StockApiData[]): StockData[] => {
  return response
    .map((obj) => ({
      company: obj.symbol,
      open: obj.open,
      high: obj.high,
      low: obj.low,
      close: obj.close,
      volume: obj.volume,
      change: obj.change,
      changePercent: obj.changePercent,
      date: new Date(obj.date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};
