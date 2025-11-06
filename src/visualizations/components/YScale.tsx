import { type FC, useEffect } from 'react';
import { GRID_HEIGHT } from '../constants';
import { select, axisLeft } from 'd3';
import { useYTicks } from '@/visualizations/graph-hooks';
import { usePlot } from '@/components/SleepData/hooks';
import { useGraphColors } from '../../design-system/hooks';

const SCALE_ID = 'y-scale';
const SCALE_X_OFFSET = -6;
const LABEL_X_OFFSET = -30;
const LABEL_FONT_SIZE_PX = 8;

export const YScale: FC = () => {
  const { svg, yScale, yAxisDisplay } = usePlot();
  const invertedScale = yScale.invert;
  const ticks = useYTicks().map(invertedScale);
  const { text, lightText } = useGraphColors();
  useEffect(() => {
    if (svg != null) {
      const selection = select(svg).select<SVGSVGElement>(`#${SCALE_ID}`);
      if (selection != null) {
        const reversedYScale = yScale.copy().range([GRID_HEIGHT, 0]);

        const yAxis = axisLeft(reversedYScale).tickSize(0).tickValues(ticks);
        selection.call(yAxis);

        selection.select('.domain').attr('stroke', 'none');
        selection.selectAll('.tick text').attr('color', text).style('font-size', '.4rem');
      }
    }
  }, [svg, ticks, yScale, text]);

  return (
    <>
      <g id={SCALE_ID} transform={`translate(${SCALE_X_OFFSET}, 0)`} />
      <g id="scale-label" transform={`translate(${LABEL_X_OFFSET}, ${GRID_HEIGHT / 2 + 26})`}>
        <text
          fill={lightText}
          fontWeight={600}
          strokeWidth={0}
          style={{ fontSize: LABEL_FONT_SIZE_PX }}
          transform="rotate(-90)"
        >
          {yAxisDisplay}
        </text>
      </g>
    </>
  );
};
