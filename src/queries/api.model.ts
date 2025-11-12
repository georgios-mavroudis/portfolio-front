import { type CompanySymbol } from './stock-data/model';

export const API = {
  STOCK_DATA: {
    GET: {
      DATA: (companySymbol: CompanySymbol, apiKey: string) =>
        `https://financialmodelingprep.com/stable/historical-price-eod/full?symbol=${companySymbol}&apikey=${apiKey}`,
    },
  },
};
