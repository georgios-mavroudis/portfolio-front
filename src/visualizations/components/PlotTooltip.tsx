import { type FC, useMemo } from 'react';
import { type Data } from '@/types/sleep-data-types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { PALETTE } from '@/design-system/palette';
import { SPACES } from '@/design-system/tokens/spacing';

type Props = {
  datum: Data | null;
  mouseX: number | null;
};
const TOOLTIP_WIDTH = 310;
const TOOLTIP_HEIGHT = 110;
const PADDING = SPACES.sm; // TODO: use design system spacing

export const PlotTooltip: FC<Props> = ({ datum, mouseX }) => {
  const tooltipXPos = useMemo(() => {
    if (!mouseX) {
      return 0;
    }

    return mouseX - TOOLTIP_WIDTH - PADDING > 0
      ? mouseX - TOOLTIP_WIDTH - PADDING
      : mouseX + PADDING;
  }, [mouseX]);

  if (!mouseX || !datum) {
    return null;
  }
  const { score, duration, meanHr, bedTime, wakeTime } = datum;
  return (
    <>
      <foreignObject x={tooltipXPos} y={0} width={TOOLTIP_WIDTH} height={TOOLTIP_HEIGHT + 5}>
        <Box
          width={TOOLTIP_WIDTH}
          height={'100%'}
          background="background.primary"
          border={`1px solid ${PALETTE.grey['100']}`}
          borderRadius={3}
          p="sm"
          opacity={0.9}
        >
          <Flex direction="column" align={'center'}>
            <Box>
              <Text>
                <b>Sleep Score: </b>
                {`${score} %`}
              </Text>
            </Box>
            <Text>
              <b>Sleep Duration: </b>
              {duration.hours ? `${duration.hours} h ` : ''}
              {duration.minutes ? `${duration.minutes} mins` : ''}
            </Text>
            <Text>
              <b>Mean Heart Rate: </b>
              {`${meanHr} bpm`}
            </Text>
            {wakeTime && bedTime && (
              <Text>
                <b>Time to Bed: </b>
                {`${format(wakeTime, "HH':'mm")} - ${format(bedTime, "HH':'mm")}`}
              </Text>
            )}
          </Flex>
        </Box>
      </foreignObject>
    </>
  );
};
