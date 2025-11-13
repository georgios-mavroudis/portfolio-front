import { Grid, Stack } from '@chakra-ui/react';
import { Header } from './components/Header';
import { Outlet } from '@tanstack/react-router';
import { ThemeProvider } from './design-system/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LavaBackground } from './components/LavaBackground';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack zIndex={0} position="relative" height="full">
          <LavaBackground count={20} opacity={0.5} blur={28} speedRange={[18, 36]} zIndex={-1} />
          <Stack zIndex={1} position="relative">
            <Header />
            <Grid
              width="full"
              minH="full"
              templateColumns={{ base: '1fr', md: '1fr' }}
              templateRows="auto 1fr auto"
              gap={4}
            >
              <Stack p={4}>
                <Outlet />
              </Stack>
            </Grid>
          </Stack>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
