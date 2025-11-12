import { defineSemanticTokens } from '@chakra-ui/react';

export const colors = defineSemanticTokens({
  colors: {
    background: {
      primary: { value: { base: '{colors.common.white}', _dark: '{colors.brand.800}' } },
      'primary-hover': { value: { base: '{colors.brand.50}', _dark: '{colors.brand.700}' } },
      'primary-active': { value: { base: '{colors.brand.100}', _dark: '{colors.brand.600}' } },
      secondary: { value: { base: '{colors.grey.50}', _dark: '{colors.grey.800}' } },
      error: { value: { base: '{colors.red.50}', _dark: '{colors.red.800}' } },
      success: { value: { base: '{colors.green.50}', _dark: '{colors.green.800}' } },
      warning: { value: { base: '{colors.orange.50}', _dark: '{colors.orange.800}' } },
      info: { value: { base: '{colors.blue.50}', _dark: '{colors.blue.800}' } },
    },
    foreground: {
      primary: { value: { base: '{colors.brand.500}', _dark: '{colors.brand.100}' } },
      'primary-hover': { value: { base: '{colors.brand.700}', _dark: '{colors.brand.200}' } },
      'primary-active': { value: { base: '{colors.brand.800}', _dark: '{colors.brand.300}' } },
      disabled: { value: { base: '{colors.brand.600}', _dark: '{colors.brand.50}' } },
      secondary: { value: { base: '{colors.grey.700}', _dark: '{colors.grey.100}' } },
      error: { value: { base: '{colors.red.700}', _dark: '{colors.red.100}' } },
      success: { value: { base: '{colors.green.700}', _dark: '{colors.green.100}' } },
      warning: { value: { base: '{colors.orange.700}', _dark: '{colors.orange.100}' } },
      info: { value: { base: '{colors.blue.700}', _dark: '{colors.blue.100}' } },
    },
    border: {
      primary: { value: { base: '{colors.brand.700}', _dark: '{colors.brand.100}' } },
      secondary: { value: { base: '{colors.grey.700}', _dark: '{colors.grey.100}' } },
      error: { value: { base: '{colors.red.700}', _dark: '{colors.red.100}' } },
      success: { value: { base: '{colors.green.700}', _dark: '{colors.green.100}' } },
      warning: { value: { base: '{colors.orange.700}', _dark: '{colors.orange.100}' } },
      info: { value: { base: '{colors.blue.700}', _dark: '{colors.blue.100}' } },
    },
    text: {
      primary: { value: { base: '{colors.common.black}', _dark: '{colors.common.white}' } },
      secondary: { value: { base: '{colors.common.white}', _dark: '{colors.brand.700}' } },
    },
    icons: {},
    graph: {
      background: { value: { base: '{colors.common.white}', _dark: '{colors.brand.700}' } },
    },
  },
});
