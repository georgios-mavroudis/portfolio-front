import { Axises } from '@/visualizations/components/Axises';
import { GRID, INTERACTIVE_CONTAINER, INTERACTIVE_PLOT } from '@/visualizations/constants';
import { AbsoluteCenter, Box, Spinner } from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import type { StockData } from '@/queries/stock-data/model';
import {
  LOCALE_MAPPING,
  usePlot,
  useResizeObserver,
  useZoomAndPan,
} from '@/visualizations/graph-hooks';
import { useGraphColors } from '@/design-system/hooks';
import { Candlesticks } from './Candlesticks';
import { MonthSeparators } from '@/visualizations/components/MonthSeparators';
import { format } from 'date-fns';
import { PALETTE } from '@/design-system/palette';
import { roundToSpecificDecimals } from '@/common/helpers';
import { useTranslation } from 'react-i18next';
import { FONT_SIZES } from '@/design-system/tokens/fonts';

type Props = {
  data: StockData[];
  loading?: boolean;
};

const OFFSET = 50;
const VIEWBOX_HEIGHT_OFFSET = 65;

export const StockChart: FC<Props> = ({ data, loading = false }) => {
  const {
    dateScale,
    yScale,
    dimensions: { height, width },
    setDimensions,
    setSvg,
  } = usePlot();
  const { ref, width: refWidth } = useResizeObserver<HTMLDivElement>();
  const { mouseX, mouseY } = useZoomAndPan();
  const { mouseLine } = useGraphColors();
  console.log(refWidth);
  useEffect(() => {
    setDimensions({ width: refWidth });
  }, [refWidth]);
  const { i18n } = useTranslation();
  return (
    <Box
      ref={ref}
      rounded="md"
      width="full"
      // style={{ width: '100%' }}
      boxShadow="md"
      bg="graph.background"
      borderWidth={1}
      p="md"
    >
      <svg
        id={INTERACTIVE_PLOT}
        viewBox={`0 0 ${width} ${height + VIEWBOX_HEIGHT_OFFSET}`}
        height={height}
        width={'calc(100%)'}
        ref={setSvg}
      >
        <g id={GRID} transform={`translate(0, 0)`}>
          {!loading && (
            <>
              <svg>
                <Candlesticks data={data} />
              </svg>
              <MonthSeparators />
              {mouseY && mouseX && (
                <>
                  <line
                    x1={0}
                    x2={width}
                    y1={mouseY ?? 0}
                    y2={mouseY ?? 0}
                    stroke={mouseLine}
                    strokeDasharray={2}
                    pointerEvents="none"
                  />
                  <line
                    x1={mouseX}
                    x2={mouseX}
                    y1={0}
                    y2={height}
                    stroke={mouseLine}
                    strokeDasharray={2}
                    pointerEvents="none"
                  />
                </>
              )}
            </>
          )}
          <rect
            id={INTERACTIVE_CONTAINER}
            width={width + 'px'}
            height={height + 'px'}
            fill="transparent"
            cursor="crosshair"
          />
        </g>
        <g transform={`translate(0, 0)`}>
          <Axises withBorders={true} fontSize={10} />
          {mouseX && (
            <g>
              <defs>
                <filter x="-.1" y="-.1" width="1.2" height="1.2" id="solid">
                  <feFlood floodColor={PALETTE.grey[100]} result="bg" />
                  <feMerge>
                    <feMergeNode in="bg" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                filter="url(#solid)"
                y={height + OFFSET}
                x={mouseX ?? 0}
                style={{ fontSize: FONT_SIZES.sm }}
                fill={PALETTE.common.black}
              >
                {formatDate(dateScale.invert(mouseX), i18n.language)}
              </text>
            </g>
          )}
          {mouseY && (
            <g transform={`translate(-${OFFSET - 6}, 0)`}>
              <defs>
                <filter x="-.1" y="-.1" width="1.2" height="1.2" id="solid">
                  <feFlood floodColor={PALETTE.grey[100]} result="bg" rx={10} ry={10} />
                  <feMerge>
                    <feMergeNode in="bg" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                filter="url(#solid)"
                y={mouseY + 4}
                style={{ fontSize: FONT_SIZES.sm }}
                fill={PALETTE.common.black}
              >
                {roundToSpecificDecimals(yScale.invert(height - mouseY), 2)}
              </text>
            </g>
          )}
        </g>
      </svg>
      {loading && (
        <AbsoluteCenter>
          <Spinner color="primary.500" size="xl" />
        </AbsoluteCenter>
      )}
    </Box>
  );
};

const formatDate = (date: Date, language: string) =>
  format(date, 'E do MMM yy', { locale: LOCALE_MAPPING[language] || LOCALE_MAPPING['en'] });
