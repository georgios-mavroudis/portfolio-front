import { Grid, Stack } from '@chakra-ui/react';
import { Header } from './components/Header';
import { Outlet } from '@tanstack/react-router';
import { ThemeProvider } from './design-system/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Grid
          w="100vw"
          minH="100vh"
          templateColumns={{ base: '1fr', md: '1fr' }}
          templateRows="auto 1fr auto"
          gap={4}
        >
          <Header />
          <Stack p={4}>
            <Outlet />
          </Stack>
        </Grid>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
