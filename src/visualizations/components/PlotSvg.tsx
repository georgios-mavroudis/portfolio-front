import { type FC, type PropsWithChildren } from 'react';
import { Svg } from './Svg';
import { PLOT_HEIGHT, PLOT_MARGIN, SVG_HEIGHT, SVG_WIDTH } from '../constants';

export const PlotSvg: FC<
  PropsWithChildren<{
    id?: string;
    reference?: React.Ref<SVGSVGElement>;
    height?: number | string;
    width?: number | string;
    viewBox?: { width: number; height: number };
    aspectRatio?: string;
  }>
> = ({
  id,
  children,
  reference,
  width = 'calc(100%)',
  height = PLOT_HEIGHT,
  viewBox = { width: SVG_WIDTH, height: SVG_HEIGHT },
  aspectRatio = 'xMidYMid',
}) => {
  return (
    <Svg
      id={id}
      ref={reference}
      view={viewBox}
      cursor="initial"
      preserveAspectRatio={aspectRatio}
      style={{
        marginTop: PLOT_MARGIN.top,
        left: 0,
        top: 0,
        position: 'relative',
        userSelect: 'none',
      }}
      width={width}
      height={height}
    >
      {children}
    </Svg>
  );
};
