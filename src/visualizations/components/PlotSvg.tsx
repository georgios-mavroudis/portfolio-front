import { type FC, type PropsWithChildren } from 'react';
import { Svg } from './Svg';
import { PLOT_HEIGHT, PLOT_MARGIN, SVG_HEIGHT, SVG_WIDTH } from '../constants';

export const PlotSvg: FC<
  PropsWithChildren<{
    id?: string;
    reference?: any;
  }>
> = ({ id, children, reference }) => {
  return (
    <Svg
      id={id}
      ref={reference}
      view={{ width: SVG_WIDTH, height: SVG_HEIGHT }}
      cursor="initial"
      preserveAspectRatio="xMinYMax slice"
      style={{
        marginTop: PLOT_MARGIN.top,
        left: 0,
        top: 0,
        position: 'relative',
        userSelect: 'none',
      }}
      width={`calc(100% - ${PLOT_MARGIN.left}px)`}
      height={PLOT_HEIGHT}
    >
      {children}
    </Svg>
  );
};
