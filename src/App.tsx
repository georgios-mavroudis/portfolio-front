import { Grid, Stack } from '@chakra-ui/react';
import { Header } from './components/Header';
import { useRef } from 'react';
import { Outlet } from '@tanstack/react-router';

function App() {
  const drawerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Grid
        ref={drawerRef}
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
    </>
  );
}

export default App;
