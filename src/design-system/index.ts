import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { colors } from './tokens/colors';
import { colors as semanticColors } from './semantic-tokens/colors';
import { buttonRecipe } from './recipes/button.recipe';
import { alertSlotRecipe } from '@chakra-ui/react/theme';
import { spacing } from './tokens/spacing';

const config = defineConfig({
  // strictTokens: true,
  globalCss: {
    body: {
      bg: 'background.primary',
    },
  },
  theme: {
    // textStyles: {},
    tokens: {
      ...colors,
      ...spacing,
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
