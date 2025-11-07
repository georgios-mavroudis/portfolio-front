export type StockApiData = {
  // The response is not a very well structured json object,
  // so we cannot have 2 keys
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': CompanySymbol;
    '3. Last Refreshed': string;
    '4. Output Size': OutputSize;
    '5. Time Zone': string;
  };
  [timeseries: string]: {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  }[];
};
export interface StockData {
  id: number;
  bedTime: Date;
  wakeTime: Date;
}

export type StockDataFrequency =
  | typeof TIME_SERIES_DAILY
  | typeof TIME_SERIES_WEEKLY
  | typeof TIME_SERIES_MONTHLY;

export const TIME_SERIES_DAILY = 'TIME_SERIES_DAILY';
export const TIME_SERIES_WEEKLY = 'TIME_SERIES_WEEKLY';
export const TIME_SERIES_MONTHLY = 'TIME_SERIES_MONTHLY';

export type CompanySymbol =
  | typeof TESLA
  | typeof IBM
  | typeof APPLE
  | typeof MICROSOFT
  | typeof SnP_500
  | typeof BITCOIN;

export const TESLA = 'TSLA';
export const IBM = 'IBM';
export const APPLE = 'AAPL';
export const MICROSOFT = 'MSFT';
export const SnP_500 = 'SPY';
export const BITCOIN = 'BTC/USD';

export type OutputSize = 'compact' | 'full';
