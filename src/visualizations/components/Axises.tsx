import { type FC, useEffect } from 'react';
import {
  closestZoomLevel,
  GRID_HEIGHT,
  GRID_WIDTH,
  PLOT_MARGIN,
  ZOOM_LEVELS_MAP,
} from '@/visualizations/constants';
import { select, type NumberValue, axisBottom } from 'd3';
import { getBottomTicks, tickInterval } from '@/visualizations/graph-hooks';
import { YScale } from './YScale';
import { usePlot } from '@/components/SleepData/hooks';
import { useGraphColors } from '../../design-system/hooks';

const DAYS_MARGIN = 12;
const MONTHS_MARGIN = 28;
const MONTH_SEPARATOR_MARGIN = 10;
const DAY_ID = 'day';
const MONTH_ID = 'month';
export const Axises: FC = () => {
  const { dateScale, svg, transform } = usePlot();
  const { text, lightText } = useGraphColors();
  useEffect(() => {
    if (svg != null) {
      const zoomLevel = closestZoomLevel(transform.k);

      const daysSelection = select(svg).select<SVGSVGElement>(`#${DAY_ID}`);
      if (daysSelection != null) {
        const [duration, unit] = ZOOM_LEVELS_MAP[zoomLevel].ticksInterval1;
        const [interval, format] = tickInterval(duration, unit);
        const xAxis = axisBottom(dateScale)
          .ticks(interval)
          .tickSize(0)
          .tickFormat(format as (date: Date | NumberValue) => string);

        daysSelection.call(xAxis);

        daysSelection.select('.domain').attr('stroke', 'none');
        daysSelection.selectAll('.tick text').attr('color', text).style('font-size', '.4rem');
      }

      const monthsSelection = select(svg).select<SVGSVGElement>(`#${MONTH_ID}`);
      if (monthsSelection != null) {
        const [startDate, endDate] = dateScale.domain();
        const [, unit] = ZOOM_LEVELS_MAP[zoomLevel].ticksInterval2;
        const timeScale = dateScale.copy();
        const ticks = getBottomTicks(startDate, endDate, unit, dateScale);

        const xAxis = axisBottom(timeScale)
          .tickValues(ticks.map((tick) => tick.date))
          .tickSize(0)
          .tickFormat((_, index) => ticks[index].name);

        monthsSelection.call(xAxis);

        monthsSelection.select('.domain').attr('stroke', 'none');

        monthsSelection
          .selectAll('.tick text')
          .attr('color', lightText)
          .style('font-size', '.4rem');
      }
    }
  }, [svg, dateScale, transform.k, text, lightText]);

  return (
    <>
      <YScale />
      <svg width={GRID_WIDTH}>
        <g id={DAY_ID} transform={`translate(0, ${GRID_HEIGHT + DAYS_MARGIN})`} />
        <g
          id={MONTH_ID}
          transform={`translate(${PLOT_MARGIN.left + MONTH_SEPARATOR_MARGIN}, ${
            GRID_HEIGHT + MONTHS_MARGIN
          })`}
        />
      </svg>
    </>
  );
};
