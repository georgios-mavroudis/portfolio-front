import { type CompanySymbol, type OutputSize, type StockDataFrequency } from './stock-data/model';

export const API = {
  STOCK_DATA: {
    GET: {
      DATA: (
        apiKey: string,
        frequency: StockDataFrequency,
        companySymbol: CompanySymbol,
        outputSize: OutputSize
      ) =>
        `https://www.alphavantage.co/query?function=${frequency}&symbol=${companySymbol}&outputsize=${outputSize}&apikey=${apiKey}`,
    },
  },
};
