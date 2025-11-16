import { Axises } from '@/visualizations/components/Axises';
import { GRID, INTERACTIVE_CONTAINER, INTERACTIVE_PLOT } from '@/visualizations/constants';
import { AbsoluteCenter, Box, Spinner } from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import type { StockData } from '@/queries/stock-data/model';
import { usePlot, useResizeObserver, useZoomAndPan } from '@/visualizations/graph-hooks';
import { useGraphColors } from '@/design-system/hooks';
import { Candlesticks } from './Candlesticks';
import { MonthSeparators } from '@/visualizations/components/MonthSeparators';
import { format } from 'date-fns';
import { PALETTE } from '@/design-system/palette';
import { roundToSpecificDecimals } from '@/common/helpers';

type Props = {
  data: StockData[];
  loading?: boolean;
};

const OFFSET = 50;
const FONT_SIZE = 12;
const VIEWBOX_HEIGHT_OFFSET = 65;
const VIEWBOX_WIDTH_OFFSET = 25;

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

  useEffect(() => {
    setDimensions({ width: refWidth });
  }, [refWidth]);

  return (
    <Box
      ref={ref}
      rounded="md"
      width="full"
      boxShadow="md"
      bg="graph.background"
      borderWidth={1}
      p="md"
    >
      <svg
        id={INTERACTIVE_PLOT}
        viewBox={`0 0 ${width + VIEWBOX_WIDTH_OFFSET} ${height + VIEWBOX_HEIGHT_OFFSET}`}
        height={height}
        width={width}
        ref={setSvg}
        preserveAspectRatio="xMinYMax slice"
      >
        <g id={GRID} transform={`translate(${OFFSET}, 0)`}>
          {!loading && (
            <>
              <svg x={0} y={0}>
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
        <g transform={`translate(${OFFSET}, 0)`}>
          <Axises withBorders={true} fontSize={FONT_SIZE} />
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
                fontSize=".4rem"
                style={{ fontSize: FONT_SIZE }}
                fill={PALETTE.common.black}
              >
                {formatDate(dateScale.invert(mouseX))}
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
                style={{ fontSize: FONT_SIZE }}
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

const formatDate = (date: Date) => format(date, 'E do MMM yy');
