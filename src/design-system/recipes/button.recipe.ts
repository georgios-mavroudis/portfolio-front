import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'semibold',
    borderRadius: 'md',
    gap: 2,
    transitionProperty: 'common',
    transitionDuration: 'fast',
    _focusVisible: {
      outline: '2px solid',
      outlineOffset: '2px',
      outlineColor: 'brand.300',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  variants: {
    size: {
      sm: { h: 8, minW: 8, px: 3, fontSize: 'sm' },
      md: { h: 10, minW: 10, px: 4, fontSize: 'md' },
      lg: { h: 12, minW: 12, px: 6, fontSize: 'md' },
    },
    variant: {
      primary: {
        bg: 'foreground.primary',
        color: 'foreground.text',
        _hover: { bg: 'foreground.primary-hover' },
        _active: { bg: 'foreground.primary-active' },
        _disabled: { bg: 'foreground.disabled' },
      },
      secondary: {
        bg: 'grey.200',
        color: 'grey.900',
        _hover: { bg: 'grey.300' },
        _active: { bg: 'grey.400' },
        _disabled: { bg: 'grey.200' },
      },
      tertiary: {
        bg: 'transparent',
        color: 'foreground.primary-hover',
        _hover: { bg: 'brand.50', color: 'brand.700' },
        _active: { bg: 'brand.100' },
      },
      outline: {
        bg: 'transparent',
        color: 'foreground.primary',
        borderWidth: '1px',
        borderColor: 'brand.600',
        _hover: { bg: 'brand.50', color: 'brand.700' },
        _active: { bg: 'brand.100' },
        _disabled: { borderColor: 'grey.400', color: 'foreground.secondary' },
      },
      link: {
        bg: 'transparent',
        color: 'foreground.primary',
        h: 'auto',
        px: 0,
        textDecoration: 'underline',
        _hover: { textDecoration: 'none', color: 'foreground.primary-hover' },
        _active: { color: 'background.primary' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});
