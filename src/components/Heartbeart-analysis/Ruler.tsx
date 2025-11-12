import { useGraphColors } from '@/design-system/hooks';
import { useCallback, useMemo, type MouseEvent } from 'react';
import { pointer } from 'd3';
import { PALETTE } from '@/design-system/palette';
import { roundToSpecificDecimals } from '@/common/helpers';
import { usePlot } from '@/visualizations/graph-hooks';
import { fiducialDatumToTime } from './helpers';

export const Ruler = ({ frequency }: { frequency: number }) => {
  const {
    ruler: { x1, y1, x2, y2, rulerUpdating },
    xScale,
    yScale,
    setRuler,
    dimensions: { width, height },
  } = usePlot();
  const {
    heartBeat: { ruler, rulerBorder },
  } = useGraphColors();

  const startRuler = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const [x, y] = pointer(e);
      const x1 = xScale.invert(x);
      const y1 = yScale.invert(y);
      setRuler({ x1, y1, x2: x1, y2: y1, rulerUpdating: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xScale, yScale]
  );
  const stopRuler = useCallback(
    () => {
      setRuler({ rulerUpdating: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const mouseMove = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      if (rulerUpdating) {
        const [eventX, eventY] = pointer(e);
        const x2 = xScale.invert(eventX);
        const y2 = yScale.invert(eventY);
        setRuler({ x2, y2 });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rulerUpdating, xScale, yScale]
  );
  const {
    x,
    y,
    width: rulerWidth,
    height: rulerHeight,
  } = useMemo(() => {
    const [xMin, xMax] = [Math.min(x1, x2), Math.max(x1, x2)];
    const [yMin, yMax] = [Math.min(y1, y2), Math.max(y1, y2)];
    const [x, width] = [
      roundToSpecificDecimals(xScale(xMin), 2),
      roundToSpecificDecimals(xScale(xMax) - xScale(xMin), 2),
    ];
    const [y, height] = [
      roundToSpecificDecimals(yScale(yMin), 2),
      roundToSpecificDecimals(yScale(yMax) - yScale(yMin), 2),
    ];
    return { x, y, width, height };
  }, [x1, x2, y1, y2, xScale, yScale]);

  return (
    <svg
      width={width}
      height={height}
      style={{
        top: 0,
        position: 'absolute',
      }}
      viewBox={`0 0 ${width} ${height}`}
      onMouseDown={startRuler}
      onMouseUp={stopRuler}
      onMouseMove={mouseMove}
      cursor={'crosshair'}
    >
      {roundToSpecificDecimals(xScale.invert(width), 2) > 0 && (
        <g id="scale-label" transform={`translate(${x}, ${y - 10})`}>
          <defs>
            <filter x="0" y="0" width="1" height="1" id="solid">
              <feFlood flood-color={PALETTE.grey[100]} result="bg" />
              <feMerge>
                <feMergeNode in="bg" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <text fill={PALETTE.common.black} filter="url(#solid)" fontWeight={600} strokeWidth={0}>
            {`${roundToSpecificDecimals(Math.abs(y1 - y2), 2)} mV, ${roundToSpecificDecimals(fiducialDatumToTime(xScale.invert(width), frequency), 2)} ms`}
          </text>
        </g>
      )}
      <rect
        x={x}
        y={y}
        width={rulerWidth}
        height={rulerHeight}
        fill={ruler}
        opacity={0.5}
        stroke={rulerBorder}
      />
    </svg>
  );
};
