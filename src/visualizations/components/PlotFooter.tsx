import { HEART_RATE, SLEEP_SCORE } from '@/components/SleepData/constants';
import { Box, Button, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { type FC, useCallback } from 'react';
import { TOKENS } from '../constants';
import { useGraphColors } from '../../design-system/hooks';
import { getInitialYScale, usePlot } from '../graph-hooks';
import { useTranslation } from 'react-i18next';
import { SPACES } from '@/design-system/tokens/spacing';

const colorStyles = (color: string): Partial<React.CSSProperties> => ({
  width: SPACES.md,
  margin: SPACES.sm,
  height: SPACES.sm,
  background: color,
});

export const PlotFooter: FC = () => {
  const {
    setYScale,
    setYAxisDisplay,
    yAxisDisplay,
    setWithLine,
    withLine,
    dimensions: { height },
  } = usePlot();
  const changeYDisplay = useCallback(() => {
    const display = yAxisDisplay === SLEEP_SCORE ? HEART_RATE : SLEEP_SCORE;
    setYAxisDisplay(display);
    setYScale(getInitialYScale(display, height));
  }, [yAxisDisplay, height]);
  const showLine = useCallback(() => {
    setWithLine(!withLine);
  }, [setWithLine, withLine]);
  const {
    sleepData: { bedTime, wokeTime, sleepScorePalette },
  } = useGraphColors();
  const { t } = useTranslation();

  return (
    <Stack direction={{ base: 'column', sm: 'column', md: 'row' }} justify="space-between" p="md">
      <VStack direction="column" gap="sm">
        <Button onClick={changeYDisplay} size={{ base: 'sm', md: 'md' }}>
          {t('GARMIN_SLEEP_DATA.DISPLAY')}
        </Button>
        {yAxisDisplay === HEART_RATE && (
          <Button onClick={showLine} size={{ base: 'sm', md: 'md' }}>
            {t('GARMIN_SLEEP_DATA.SHOW_LINE')}
          </Button>
        )}
      </VStack>
      {yAxisDisplay === SLEEP_SCORE && (
        <VStack direction="column" alignItems="center">
          <Text textStyle={{ base: 'sm', sm: 'md' }}>{t('GARMIN_SLEEP_DATA.LEGEND')}</Text>
          {[TOKENS.slice(1, 5), TOKENS.slice(5, 9), TOKENS.slice(9)].map((keys, i) => (
            <HStack justifyContent="space-between" key={i}>
              {keys.map((key, j) => {
                const isLastItem = i === 2;
                const renderText = (
                  m: number,
                  n: number,
                  keysLength: number,
                  isLastItem: boolean
                ) => {
                  const k = m * keysLength + n + 3;
                  if (m === 0 && n === 0) return '< 3';
                  else if (isLastItem) return '12+';
                  else return `${k} - ${k + 1}`;
                  // else return `3 - 5`;
                };
                return (
                  <HStack marginRight={{ base: 'none', sm: 'sm' }} key={i + j}>
                    <Box style={colorStyles(sleepScorePalette[key])} />
                    <Text textAlign="center" textStyle={{ base: 'xs', sm: 'sm' }}>
                      {renderText(i, j, keys.length, isLastItem)}
                    </Text>
                  </HStack>
                );
              })}
            </HStack>
          ))}
        </VStack>
      )}
      <Stack direction="column" alignItems={{ base: 'center', md: 'start' }}>
        {[
          [t('GARMIN_SLEEP_DATA.WOKE'), wokeTime],
          [t('GARMIN_SLEEP_DATA.SLEEP'), bedTime],
        ].map(([title, color], i) => (
          <Box display="flex" key={i}>
            <Box style={colorStyles(color)} />
            <Text textStyle={{ base: 'sm', sm: 'md' }}>{title}</Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};
