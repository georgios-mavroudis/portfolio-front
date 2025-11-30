import { defineSlotRecipe } from '@chakra-ui/react';
import { alertAnatomy } from '@chakra-ui/react/anatomy';

export const AlertSlotRecipe = defineSlotRecipe({
  slots: alertAnatomy.keys(),
  base: {},
  variants: {
    variant: {
      error: {
        root: {
          bg: 'background.error',
          color: 'foreground.error',
        },
      },
    },
  },
});
