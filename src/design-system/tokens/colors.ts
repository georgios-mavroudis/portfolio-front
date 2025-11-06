import { defineTokens } from '@chakra-ui/react';
import { colorToChakra } from '../helpers/utils';
import { PALETTE } from '../palette';

export const colors = defineTokens({
  colors: {
    brand: colorToChakra(PALETTE.brand),
    grey: colorToChakra(PALETTE.grey),
    red: colorToChakra(PALETTE.red),
    orange: colorToChakra(PALETTE.orange),
    green: colorToChakra(PALETTE.green),
    blue: colorToChakra(PALETTE.blue),
    lightBrown: colorToChakra(PALETTE.lightBrown),
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
