import { useThemeBreakpointValue } from '@/design-system/tokens/breakpoints';
import { AbsoluteCenter, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const NotFound = () => {
  const { t } = useTranslation();
  const breakpointValue = useThemeBreakpointValue();
  return (
    <Stack width="full" height={breakpointValue === 'base' ? 'sm' : breakpointValue}>
      <AbsoluteCenter>
        <Text textStyle="subtitle" color="foreground.primary">
          {t('NOT_FOUND.NO_PAGE')}
        </Text>
      </AbsoluteCenter>
    </Stack>
  );
};
