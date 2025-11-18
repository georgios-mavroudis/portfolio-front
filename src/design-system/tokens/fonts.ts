import { defineTokens } from '@chakra-ui/react';
import { tokenToChakra } from '../helpers/utils';

export const FONT_SIZES = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 17,
};
export const fonts = defineTokens({
  fonts: {
    inter: { value: 'Inter' },
  },
  fontWeights: {
    regular: { value: 400 },
    semibold: { value: 500 },
    bold: { value: 600 },
  },
  fontSizes: tokenToChakra(FONT_SIZES),
  lineHeights: {
    sm: { value: '14px' },
    md: { value: '17px' },
    lg: { value: '20px' },
    auto: { value: 'auto' },
  },
});
