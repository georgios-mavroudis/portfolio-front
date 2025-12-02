import { memo, useEffect, type FC } from 'react';
import { Box } from '@chakra-ui/react';
import { usePlot, useResizeObserver, useZoomAndPan } from '@/visualizations/graph-hooks';
import {
  GRID,
  GRID_HEIGHT,
  INTERACTIVE_CONTAINER,
  INTERACTIVE_PLOT,
  PLOT_MARGIN,
} from '@/visualizations/constants';
import { ScorePlot } from '@/visualizations/components/ScorePlot';
import { HRPlot } from '@/visualizations/components/HRPlot';
import { MonthSeparators } from '@/visualizations/components/MonthSeparators';
import { MouseLine } from '@/visualizations/components/MouseLine';
import { SleepIndicator } from '@/visualizations/components/SleepIndicator';
import { PlotTooltip } from '@/visualizations/components/PlotTooltip';
import { Axises } from '@/visualizations/components/Axises';
import { useFindHoveredDatum } from './hooks';
import { SLEEP_SCORE } from './constants';
import type { Data } from '@/types/sleep-data-types';
import { PlotFooter } from '@/visualizations/components/PlotFooter';
import { Grid } from '@/visualizations/components/Grid';

type Props = {
  data: Data[];
};

export const Graph: FC<Props> = memo(({ data }) => {
  const {
    setSvg,
    yAxisDisplay,
    dimensions: { width, height },
    setDimensions,
  } = usePlot();
  const { mouseX, isDragging } = useZoomAndPan();
  const { ref, width: refWidth } = useResizeObserver<HTMLDivElement>();
  useEffect(() => {
    setDimensions({ width: refWidth, height: GRID_HEIGHT * 4 });
  }, [refWidth]);

  const findHoveredDatum = useFindHoveredDatum(data);
  const datum = findHoveredDatum(mouseX);
  return (
    <Box
      ref={ref}
      width="full"
      height="full"
      borderWidth={1}
      borderColor="neutral.100"
      rounded="md"
      position="relative"
      bg="graph.background"
      boxShadow="md"
    >
      <Box>
        <svg
          id={INTERACTIVE_PLOT}
          ref={setSvg}
          width={`calc(100%)`}
          height={height}
          viewBox={`0 0 ${width + 40}, ${height + PLOT_MARGIN.top * 4}`}
        >
          <g id={GRID} transform="translate(0,20)">
            <svg>
              <Grid />
              <SleepIndicator data={data} />
              {yAxisDisplay === SLEEP_SCORE ? (
                <ScorePlot data={data} hoveredBar={datum} />
              ) : (
                <HRPlot data={data} mouseX={mouseX} hoveredPoint={datum} />
              )}
              <MonthSeparators />
              <MouseLine mouseX={mouseX} datum={datum} />
            </svg>
            <rect
              id={INTERACTIVE_CONTAINER}
              width={width + 'px'}
              height={height + 'px'}
              fill="transparent"
              cursor={isDragging ? 'grabbing' : 'grab'}
            />
            {datum && <PlotTooltip datum={datum} mouseX={mouseX} />}
            <Axises />
          </g>
          {/* <rect x={0} y={0} width={LEFT_OFFSET} height={height} fill={background} /> */}
          {/* <g transform={`translate(${LEFT_OFFSET}, ${PLOT_MARGIN.top})`}> */}
        </svg>
        {/* </PlotSvg> */}
      </Box>
      <Box>
        <PlotFooter />
      </Box>
    </Box>
  );
});
