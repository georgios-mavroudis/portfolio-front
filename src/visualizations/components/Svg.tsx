import React, { forwardRef } from 'react';

interface Props extends React.SVGProps<SVGSVGElement> {
  view?: { width: number; height: number };
}

export const Svg = forwardRef<SVGSVGElement, Props>(
  ({ view = { width: 0, height: 0 }, children, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        id={props.id}
        version="1.1"
        preserveAspectRatio="xMinYMax slice"
        width={view.width}
        height={view.height}
        viewBox={view && `0 0 ${view.width} ${view.height}`}
        style={{ display: 'inherit' }}
        {...props}
      >
        {children}
      </svg>
    );
  }
);
