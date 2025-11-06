import { memo, type FC } from 'react';
import { Box } from '@chakra-ui/react';
import { useZoomAndPan } from '@/visualizations/graph-hooks';
import { PlotSvg } from '@/visualizations/components/PlotSvg';
import {
  GRID,
  GRID_HEIGHT,
  GRID_WIDTH,
  INTERACTIVE_CONTAINER,
  INTERACTIVE_PLOT,
  LEFT_OFFSET,
  PLOT_MARGIN,
  SVG_HEIGHT,
} from '@/visualizations/constants';
import { ScorePlot } from '@/visualizations/components/ScorePlot';
import { HRPlot } from '@/visualizations/components/HRPlot';
import { MonthSeparators } from '@/visualizations/components/MonthSeparators';
import { MouseLine } from '@/visualizations/components/MouseLine';
import { SleepIndicator } from '@/visualizations/components/SleepIndicator';
import { PlotTooltip } from '@/visualizations/components/PlotTooltip';
import { Axises } from '@/visualizations/components/Axises';
import { useFindHoveredDatum, usePlot } from './hooks';
import { SLEEP_SCORE } from './constants';
import type { Data } from '@/types/sleep-data-types';
import { PlotFooter } from '@/visualizations/components/PlotFooter';
import { Grid } from '@/visualizations/components/Grid';
import { useGraphColors } from '@/design-system/hooks';

type Props = {
  data: Data[];
};

export const Graph: FC<Props> = memo(({ data }) => {
  const { setSvg, yAxisDisplay } = usePlot();
  const { mouseX, isDragging } = useZoomAndPan();
  const findHoveredDatum = useFindHoveredDatum(data);
  const datum = findHoveredDatum(mouseX);
  const { background } = useGraphColors();
  return (
    <>
      <Box
        width="100%"
        height="100%"
        borderRadius="0.25rem"
        borderWidth="0.0625rem"
        borderColor="neutral.100"
        position="relative"
        overflowX="hidden"
        bg="graph.background"
        boxShadow="md"
      >
        <Box position="absolute" left={0} right={1} overflowX="hidden">
          <PlotSvg id={GRID}>
            <g transform={`translate(${LEFT_OFFSET}, ${PLOT_MARGIN.top})`}>
              <Grid />
            </g>
          </PlotSvg>
        </Box>
        <Box>
          <PlotSvg id={INTERACTIVE_PLOT} reference={setSvg}>
            <g id={GRID} transform={`translate(${LEFT_OFFSET}, ${PLOT_MARGIN.top})`}>
              <SleepIndicator data={data} />
              {yAxisDisplay === SLEEP_SCORE ? (
                <ScorePlot data={data} hoveredBar={datum} />
              ) : (
                <HRPlot data={data} mouseX={mouseX} hoveredPoint={datum} />
              )}
              <MonthSeparators />
              <MouseLine mouseX={mouseX} datum={datum} />
              <rect
                id={INTERACTIVE_CONTAINER}
                width={GRID_WIDTH + 'px'}
                height={GRID_HEIGHT + 'px'}
                fill="transparent"
                cursor={isDragging ? 'grabbing' : 'grab'}
              />
              {datum && <PlotTooltip datum={datum} mouseX={mouseX} />}
            </g>
            <rect x={0} y={0} width={LEFT_OFFSET} height={SVG_HEIGHT} fill={background} />
            <g transform={`translate(${LEFT_OFFSET}, ${PLOT_MARGIN.top})`}>
              <Axises />
            </g>
          </PlotSvg>
        </Box>
        <Box>
          <PlotFooter />
        </Box>
      </Box>
    </>
  );
});
