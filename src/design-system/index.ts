import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { colors } from './tokens/colors';
import { colors as semanticColors } from './semantic-tokens/colors';
import { buttonRecipe } from './recipes/button.recipe';
import { alertSlotRecipe } from '@chakra-ui/react/theme';
import { spacing } from './tokens/spacing';
import { textStyles } from './tokens/text-styles';
import { fonts } from './tokens/fonts';
import { breakpoints } from '@chakra-ui/react/theme';

const config = defineConfig({
  globalCss: {
    body: {
      bg: 'background.primary',
    },
  },
  theme: {
    breakpoints,
    textStyles,
    tokens: {
      ...colors,
      ...spacing,
      ...fonts,
    },
    semanticTokens: {
      ...semanticColors,
    },
    recipes: {
      button: buttonRecipe,
    },
    slotRecipes: {
      alert: alertSlotRecipe,
    },
  },
});
const system = createSystem(defaultConfig, config);
export default system;
