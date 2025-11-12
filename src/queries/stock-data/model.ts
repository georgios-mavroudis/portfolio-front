import type { SelectOption } from '@/design-system/components/Select';
import type { CollectionOptions } from '@chakra-ui/react';

export type StockApiData = {
  change: number;
  changePercent: number;
  close: number;
  date: string;
  high: number;
  low: number;
  open: number;
  symbol: CompanySymbol;
  volume: number;
  vwap: number;
};
export interface StockData {
  company: CompanySymbol;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
  date: Date;
}

export type CompanySymbol =
  | typeof TESLA
  | typeof AMAZON
  | typeof APPLE
  | typeof MICROSOFT
  | typeof SnP_500
  | typeof NVIDIA;

// TSLA, AMZN, MSFT, NVDA, GOOGL, META,
export const TESLA = 'TSLA';
export const AMAZON = 'AMZN';
export const NVIDIA = 'NVDA';
export const APPLE = 'AAPL';
export const META = 'META';
export const MICROSOFT = 'MSFT';
export const SnP_500 = 'SPY';

export const COMPANIES: SelectOption<CompanySymbol>[] = [
  { label: 'Apple', value: APPLE },
  { label: 'Tesla', value: TESLA },
  { label: 'Amazon', value: AMAZON },
  { label: 'Microsoft', value: MICROSOFT },
  { label: 'S&P 500', value: SnP_500 },
  { label: 'Nvidia', value: NVIDIA },
] as const;

export const companyListCollection: CollectionOptions<SelectOption<string>> = { items: COMPANIES };
export type OutputSize = 'compact' | 'full';
