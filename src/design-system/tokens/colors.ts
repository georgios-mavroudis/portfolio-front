import { defineTokens } from '@chakra-ui/react';
import { tokenToChakra } from '../helpers/utils';
import { PALETTE } from '../palette';

export const colors = defineTokens({
  colors: {
    brand: tokenToChakra(PALETTE.brand),
    grey: tokenToChakra(PALETTE.grey),
    red: tokenToChakra(PALETTE.red),
    orange: tokenToChakra(PALETTE.orange),
    green: tokenToChakra(PALETTE.green),
    blue: tokenToChakra(PALETTE.blue),
    lightBrown: tokenToChakra(PALETTE.lightBrown),
    common: {
      white: { value: PALETTE.common.white },
      black: { value: PALETTE.common.black },
    },
    text: {
      primary: { value: PALETTE.text.primary },
      secondary: { value: PALETTE.text.secondary },
    },
    disabled: { value: PALETTE.disabled },
  },
});
