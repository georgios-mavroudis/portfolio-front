import { HEART_RATE, SLEEP_SCORE } from '@/components/SleepData/constants';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { type FC, useCallback } from 'react';
import { TOKENS } from '../constants';
import { useGraphColors } from '../../design-system/hooks';
import { getInitialYScale, usePlot } from '../graph-hooks';

const TITLE_FONT_SIZE = 16;
export const SPACING_S = 8; // TODO: spacing.s
export const SPACING_M = 16; // TODO: spacing.m
const SPACING_XS = 4; // TODO:
const SPACING_XL = 32; // TODO
const colorStyles = (color: string): Partial<React.CSSProperties> => ({
  width: SPACING_M,
  margin: SPACING_S,
  height: SPACING_S,
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
  return (
    <Flex justify="space-between" padding={5}>
      <Flex direction="column">
        <Button onClick={changeYDisplay} width={SPACING_XL} mb={SPACING_XS}>
          Switch Display
        </Button>
        {yAxisDisplay === HEART_RATE && (
          <Button onClick={showLine} width={SPACING_XL}>
            Show line
          </Button>
        )}
      </Flex>
      {yAxisDisplay === SLEEP_SCORE && (
        <Flex direction="column" alignItems="center">
          <Flex m={2} fontSize={TITLE_FONT_SIZE}>
            Sleep (hours)
          </Flex>
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
          ['Woke Time', wokeTime],
          ['Sleep Time', bedTime],
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
