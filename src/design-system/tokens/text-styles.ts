import { defineTextStyles } from '@chakra-ui/react';

export const textStyles = defineTextStyles({
  display: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'bold',
      letterSpacing: '-0.04em',
      lineHeight: '110%',
      fontSize: {
        base: '2.75rem',
        md: '3.5rem',
        lg: '4rem',
      },
    },
  },
  h1: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
      lineHeight: '115%',
      fontSize: {
        base: '2.25rem',
        md: '2.75rem',
      },
    },
  },
  h2: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'semibold',
      letterSpacing: '-0.01em',
      lineHeight: '120%',
      fontSize: {
        base: '1.75rem',
        md: '2.25rem',
      },
    },
  },
  h3: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'semibold',
      lineHeight: '130%',
      fontSize: {
        base: '1.5rem',
        md: '1.75rem',
      },
    },
  },
  title: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'semibold',
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      lineHeight: '140%',
      fontSize: {
        base: '0.875rem',
        md: '1rem',
      },
    },
  },
  subtitle: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'medium',
      lineHeight: '140%',
      letterSpacing: '0.08em',
      fontSize: '1.25rem',
    },
  },
  lg: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'medium',
      lineHeight: '150%',
      fontSize: {
        base: '1.125rem',
        md: '1.25rem',
      },
    },
  },
  md: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'normal',
      lineHeight: '150%',
      fontSize: '1rem',
    },
  },
  sm: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'normal',
      lineHeight: '140%',
      fontSize: '0.875rem',
    },
  },
  xs: {
    value: {
      fontFamily: '{fonts.inter}',
      fontWeight: 'regular',
      lineHeight: '130%',
      letterSpacing: '0.08em',
      fontSize: '0.55rem',
    },
  },
});
