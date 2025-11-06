import { type FC, useMemo } from 'react';
import { type Data } from '@/types/sleep-data-types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { PALETTE } from '@/design-system/palette';
import { SPACING_S } from './PlotFooter';

type Props = {
  datum: Data | null;
  mouseX: number | null;
};
const TOOLTIP_WIDTH = 110;
const TOOLTIP_HEIGHT = 50;
const PADDING = SPACING_S; // TODO: use design system spacing
const FONT_SIZE_PX = 6;

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
          p={2}
          opacity={0.95}
        >
          <Flex direction="column" align={'center'}>
            <Box>
              <Text fontSize={FONT_SIZE_PX}>
                <b>Sleep Score: </b>
                {`${score} %`}
              </Text>
            </Box>
            <Text fontSize={FONT_SIZE_PX}>
              <b>Sleep Duration: </b>
              {duration.hours ? `${duration.hours} h ` : ''}
              {duration.minutes ? `${duration.minutes} mins` : ''}
            </Text>
            <Text fontSize={FONT_SIZE_PX}>
              <b>Mean Heart Rate: </b>
              {`${meanHr} bpm`}
            </Text>
            {wakeTime && bedTime && (
              <Text fontSize={FONT_SIZE_PX}>
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
