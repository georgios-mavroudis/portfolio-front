import { ChakraProvider } from '@chakra-ui/react';
import type { FC, PropsWithChildren } from 'react';
import theme from '.';
import { ColorModeProvider } from '@/components/ui/color-mode';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
};
