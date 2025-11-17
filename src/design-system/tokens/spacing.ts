import { defineTokens } from '@chakra-ui/react';
import { tokenToChakra } from '../helpers/utils';

export const SPACES = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const satisfies Record<string, number>;

export const spacing = defineTokens({
  spacing: {
    ...tokenToChakra(SPACES, false),
    sm12: { value: `12px` },
    none: { value: `0px` },
  },
});
