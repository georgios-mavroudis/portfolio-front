import { useEffect, useMemo } from 'react';
import { select, axisLeft } from 'd3';
import { usePlot, useYTicks } from '@/visualizations/graph-hooks';
import { useGraphColors } from '../../design-system/hooks';
import { useTranslation } from 'react-i18next';

const SCALE_ID = 'y-scale';
const SCALE_LABEL_ID = 'y-scale-label';
const LABEL_X_OFFSET = -30;

export const YScale = ({
  withBorders = false,
  fontSize = 8,
}: {
  position: 'left' | 'right';
  withBorders?: boolean;
  fontSize?: number;
}) => {
  const {
    svg,
    yScale,
    yAxisDisplay,
    dimensions: { height },
  } = usePlot();
  const invertedScale = yScale.invert;
  const ticks = useYTicks().map(invertedScale);
  const { text, lightText } = useGraphColors();
  useEffect(() => {
    if (svg != null) {
      const selection = select(svg).select<SVGSVGElement>(`#${SCALE_ID}`);
      if (selection != null) {
        const reversedYScale = yScale.copy().range([height, 0]);
        const yAxis = axisLeft(reversedYScale).tickSize(0).tickValues(ticks);
        selection.call(yAxis);

        selection.select('.domain').attr('stroke', 'none');

        selection.selectAll('.tick text').attr('color', text).style('font-size', fontSize);
      }
    }
  }, [svg, ticks, yScale, text, height, fontSize]);

  const { t, i18n } = useTranslation();
  const translatedLabel = useMemo(
    () =>
      yAxisDisplay === 'Heart Rate'
        ? t('GARMIN_SLEEP_DATA.Y_AXIS_LABEL.HEART_RATE')
        : t('GARMIN_SLEEP_DATA.Y_AXIS_LABEL.SLEEP_SCORE'),
    [yAxisDisplay, i18n.language]
  );
  return (
    <>
      <g id={SCALE_ID} />
      {yAxisDisplay && (
        <g transform={`translate(${LABEL_X_OFFSET}, ${height / 2 + 25})`}>
          <text
            id={SCALE_LABEL_ID}
            fill={lightText}
            fontWeight={600}
            strokeWidth={0}
            style={{ fontSize: fontSize }}
            transform="rotate(-90)"
          >
            {translatedLabel}
          </text>
        </g>
      )}
      {withBorders && (
        <line y1={0} y2={height} x1={0} x2={0} stroke={lightText} strokeWidth={0.5} />
      )}
    </>
  );
};
