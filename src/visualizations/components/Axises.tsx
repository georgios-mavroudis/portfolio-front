import { type FC, useEffect } from 'react';
import { closestZoomLevel, PLOT_MARGIN, ZOOM_LEVELS_MAP } from '@/visualizations/constants';
import { select, type NumberValue, axisBottom } from 'd3';
import { getBottomTicks, tickInterval, usePlot } from '@/visualizations/graph-hooks';
import { YScale } from './YScale';
import { useGraphColors } from '../../design-system/hooks';
import { useTranslation } from 'react-i18next';

const DAYS_MARGIN = 12;
const MONTHS_MARGIN = 28;
const MONTH_SEPARATOR_MARGIN = 10;
const DAY_ID = 'day';
const MONTH_ID = 'month';

type Props = {
  positionY?: 'left' | 'right';
  withBorders?: boolean;
  fontSize?: number;
};
export const Axises: FC<Props> = ({ positionY = 'left', withBorders = false, fontSize = 6 }) => {
  const {
    dateScale,
    svg,
    transform,
    dimensions: { height, width },
  } = usePlot();
  const { text, lightText } = useGraphColors();
  const { i18n } = useTranslation();

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
        daysSelection.selectAll('.tick text').attr('color', text).style('font-size', fontSize);
      }

      const monthsSelection = select(svg).select<SVGSVGElement>(`#${MONTH_ID}`);
      if (monthsSelection != null) {
        const [startDate, endDate] = dateScale.domain();
        const [, unit] = ZOOM_LEVELS_MAP[zoomLevel].ticksInterval2;
        const timeScale = dateScale.copy();
        const ticks = getBottomTicks(startDate, endDate, unit, dateScale, i18n.language);

        const xAxis = axisBottom(timeScale)
          .tickValues(ticks.map((tick) => tick.date))
          .tickSize(0)
          .tickFormat((_, index) => ticks[index].name);

        monthsSelection.call(xAxis);

        monthsSelection.select('.domain').attr('stroke', 'none');

        monthsSelection
          .selectAll('.tick text')
          .attr('color', lightText)
          .style('font-size', fontSize);
      }
    }
  }, [svg, dateScale, transform.k, text, lightText, fontSize, i18n.language]);

  return (
    <>
      <YScale position={positionY} withBorders={withBorders} fontSize={fontSize} />
      <svg width={width}>
        <g id={DAY_ID} transform={`translate(0, ${height + DAYS_MARGIN})`} />
        <g
          id={MONTH_ID}
          transform={`translate(${PLOT_MARGIN.left + MONTH_SEPARATOR_MARGIN}, ${
            height + MONTHS_MARGIN
          })`}
        />
        {withBorders && (
          <line y1={height} y2={height} x1={0} x2={width} stroke={lightText} strokeWidth={0.5} />
        )}
      </svg>
    </>
  );
};
