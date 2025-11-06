import { ChakraProvider } from '@chakra-ui/react';
import type { FC, PropsWithChildren } from 'react';
import theme from '.';
import { ColorModeProvider } from '@/design-system/components/color-mode';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
};
