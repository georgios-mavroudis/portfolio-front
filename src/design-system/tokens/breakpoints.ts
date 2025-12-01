import { useBreakpointValue } from '@chakra-ui/react';

export const breakpoints = {
  base: '0rem', // 0px
  sm: '30rem', // ~480px
  md: '48rem', // ~768px
  lg: '62rem', // ~992px
  xl: '80rem', // ~1280px
  '2xl': '96rem', // ~1536px
};

export type BreakpointKey = keyof typeof breakpoints;
export const useThemeBreakpointValue = (): BreakpointKey => {
  const breakpointValue = useBreakpointValue<BreakpointKey>({
    base: 'base',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
  });

  return breakpointValue ?? 'base';
};
