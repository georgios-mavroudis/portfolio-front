import { HEART_RATE, SLEEP_SCORE } from '@/components/SleepData/constants';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { type FC, useCallback } from 'react';
import { TOKENS } from '../constants';
import { useGraphColors } from '../../design-system/hooks';
import { getInitialYScale, usePlot } from '../graph-hooks';
import { useTranslation } from 'react-i18next';
import { SPACES } from '@/design-system/tokens/spacing';

const TITLE_FONT_SIZE = 16;
const colorStyles = (color: string): Partial<React.CSSProperties> => ({
  width: SPACES.md,
  margin: SPACES.sm,
  height: SPACES.sm,
  background: color,
});

export const PlotFooter: FC = () => {
  const { setYScale, setYAxisDisplay, yAxisDisplay, setWithLine, withLine } = usePlot();
  const changeYDisplay = useCallback(() => {
    const display = yAxisDisplay === SLEEP_SCORE ? HEART_RATE : SLEEP_SCORE;
    setYAxisDisplay(display);
    setYScale(getInitialYScale(display));
  }, [yAxisDisplay]);
  const showLine = useCallback(() => {
    setWithLine(!withLine);
  }, [setWithLine, withLine]);
  const {
    sleepData: { bedTime, wokeTime, sleepScorePalette },
  } = useGraphColors();
  const { t } = useTranslation();

  return (
    <Flex justify="space-between" p="md">
      <Flex direction="column" gap="sm">
        <Button onClick={changeYDisplay}>{t('GARMIN_SLEEP_DATA.DISPLAY')}</Button>
        {yAxisDisplay === HEART_RATE && (
          <Button onClick={showLine}>{t('GARMIN_SLEEP_DATA.SHOW_LINE')}</Button>
        )}
      </Flex>
      {yAxisDisplay === SLEEP_SCORE && (
        <Flex direction="column" alignItems="center">
          <Flex fontSize={TITLE_FONT_SIZE}>{t('GARMIN_SLEEP_DATA.LEGEND')}</Flex>
          {[TOKENS.slice(1, 5), TOKENS.slice(5, 9), TOKENS.slice(9)].map((keys, i) => (
            <Flex justifyContent="space-between" key={i}>
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
                };
                return (
                  <Flex marginRight={5} key={i + j}>
                    <Box style={colorStyles(sleepScorePalette[key])} />
                    {renderText(i, j, keys.length, isLastItem)}
                  </Flex>
                );
              })}
            </Flex>
          ))}
        </Flex>
      )}
      <Flex direction="column">
        {[
          [t('GARMIN_SLEEP_DATA.WOKE'), wokeTime],
          [t('GARMIN_SLEEP_DATA.SLEEP'), bedTime],
        ].map(([title, color], i) => (
          <Box display="flex" key={i}>
            <Box style={colorStyles(color)} />
            <Text>{title}</Text>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};
