import { PlotProvider } from '@/visualizations/components/PlotContext';
import { StockChart } from './StockChart';
import { useStockData } from '@/queries/stock-data/stock-data-queries';
import { HStack, Text, VStack } from '@chakra-ui/react';
import { Alert } from '@/design-system/components/Alert';
import json from './data.json';
import { useState } from 'react';
import { StockDataContainer } from './StockDataContainer';
import { COMPANIES, companyListCollection, type CompanySymbol } from '@/queries/stock-data/model';
import { Select, type SelectOption } from '@/design-system/components/Select';

export const StockData = () => {
  const [company, setCompany] = useState<SelectOption<CompanySymbol>>({
    value: COMPANIES[0].value,
    label: COMPANIES[0].label,
  });
  const data = useStockData(company.value);
  if (data.isError) {
    return <Alert title="No Patient data found!" status="error" />;
  }

  return (
    <VStack width="full">
      <HStack alignItems="start" justifyContent="space-between" width="full">
        <VStack height="full" justifyContent="center">
          <Text textStyle="lg">{company.label}</Text>
        </VStack>
        <Select
          options={companyListCollection}
          value={company.label}
          onChange={(value) => setCompany(value.items[0] as SelectOption<CompanySymbol>)}
          title="Companies"
        />
      </HStack>
      <PlotProvider>
        <StockDataContainer data={data}>
          {({ data, loading }) => <StockChart data={data} loading={loading} />}
        </StockDataContainer>
      </PlotProvider>
    </VStack>
  );
};
