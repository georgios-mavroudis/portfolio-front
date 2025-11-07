import { useStockData } from '@/queries/stock-data/stock-data-queries';
import { PlotSvg } from '@/visualizations/components/PlotSvg';
import { Stack } from '@chakra-ui/react';

export const StockChart = () => {
  const data = useStockData();
  return (
    <Stack rounded="md" bg="graph.background" boxShadow="md">
      <PlotSvg></PlotSvg>
    </Stack>
  );
};
