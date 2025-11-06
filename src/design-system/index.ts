import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { colors } from './tokens/colors';
import { colors as semanticColors } from './semantic-tokens/colors';
import { buttonRecipe } from './recipes/button.recipe';

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
    },
    semanticTokens: {
      ...semanticColors,
    },
    recipes: {
      button: buttonRecipe,
    },
    // slotRecipes: {},
  },
});
const system = createSystem(defaultConfig, config);
export default system;
