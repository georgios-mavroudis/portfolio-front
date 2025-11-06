// import { type ScaleLinear, type ScaleTime } from 'd3-scale';
import { zoomIdentity, ZoomTransform } from 'd3-zoom';
import { type FC, type PropsWithChildren, useCallback, useMemo, useReducer, useState } from 'react';
import {
  getInitialYScale,
  getInitialXScale,
  getInitialDateScale,
} from '@/visualizations/graph-hooks';
import { SLEEP_SCORE, type YAxisDisplay } from '@/components/SleepData/constants';
import { PlotContext } from '@/components/SleepData/hooks';
import type { ScaleLinear, ScaleTime } from 'd3-scale';

export type Ruler = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  rulerUpdating: boolean;
};
export type PlotData = {
  dateScale: ScaleTime<number, number>;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  transform: ZoomTransform;
  svg: SVGElement | null;
  yAxisDisplay: YAxisDisplay;
  withLine: boolean;
  isDragging?: boolean;
  ruler: Ruler;
  setDateScale: (dateScale: ScaleTime<number, number>) => void;
  setXScale: (xScale: ScaleLinear<number, number>) => void;
  setYScale: (yScale: ScaleLinear<number, number>) => void;
  setTransform: (transform: ZoomTransform) => void;
  setSvg: (svg: SVGElement) => void;
  setYAxisDisplay: (yAxisDisplay: YAxisDisplay) => void;
  setWithLine: (withLine: boolean) => void;
  setDragging: (dragging: boolean) => void;
  setRuler: (ruler: Partial<Ruler>) => void;
};

type PlotAction =
  | {
      type: 'set-date-scale';
      dateScale: ScaleTime<number, number>;
    }
  | {
      type: 'set-x-scale';
      xScale: ScaleLinear<number, number>;
    }
  | {
      type: 'set-y-scale';
      yScale: ScaleLinear<number, number>;
    }
  | {
      type: 'set-transform';
      transform: ZoomTransform;
    }
  | {
      type: 'set-y-axis-display';
      yAxisDisplay: YAxisDisplay;
    }
  | {
      type: 'set-dragging';
      dragging: boolean;
    }
  | {
      type: 'set-ruler';
      ruler: Partial<Ruler>;
    };

const initialState = (): PlotData => ({
  dateScale: getInitialDateScale(),
  xScale: getInitialXScale(),
  yScale: getInitialYScale(SLEEP_SCORE),
  transform: zoomIdentity,
  svg: null,
  yAxisDisplay: SLEEP_SCORE,
  withLine: false,
  isDragging: false,
  ruler: { x1: 0, x2: 0, y1: 0, y2: 0, rulerUpdating: false },
  setDateScale: () => {},
  setXScale: () => {},
  setYScale: () => {},
  setTransform: () => {},
  setSvg: () => {},
  setYAxisDisplay: () => {},
  setWithLine: () => {},
  setDragging: () => {},
  setRuler: () => {},
});

const plotReducer = (state: PlotData, action: PlotAction): PlotData => {
  switch (action.type) {
    case 'set-transform':
      return { ...state, transform: action.transform };
    case 'set-date-scale':
      return { ...state, dateScale: action.dateScale };
    case 'set-x-scale':
      return { ...state, xScale: action.xScale };
    case 'set-y-scale':
      return { ...state, yScale: action.yScale };
    case 'set-dragging':
      return { ...state, isDragging: action.dragging };
    case 'set-ruler': {
      return {
        ...state,
        ruler: { ...state.ruler, ...action.ruler },
      };
    }
    case 'set-y-axis-display':
      return {
        ...state,
        yAxisDisplay: action.yAxisDisplay,
        yScale: getInitialYScale(action.yAxisDisplay),
      };
  }
};

export const PlotProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(plotReducer, initialState());
  const [svg, setSvg] = useState<SVGElement | null>(null);
  const [withLine, setWithLine] = useState(false);

  const setDateScale = useCallback((dateScale: ScaleTime<number, number>) => {
    dispatch({ type: 'set-date-scale', dateScale });
  }, []);

  const setXScale = useCallback((xScale: ScaleLinear<number, number>) => {
    dispatch({ type: 'set-x-scale', xScale });
  }, []);

  const setYScale = useCallback((yScale: ScaleLinear<number, number>) => {
    dispatch({ type: 'set-y-scale', yScale });
  }, []);

  const setTransform = useCallback((transform: ZoomTransform) => {
    dispatch({ type: 'set-transform', transform });
  }, []);

  const setYAxisDisplay = useCallback((yAxisDisplay: YAxisDisplay) => {
    dispatch({ type: 'set-y-axis-display', yAxisDisplay });
  }, []);

  const setDragging = useCallback((dragging: boolean) => {
    dispatch({ type: 'set-dragging', dragging });
  }, []);

  const setRuler = useCallback((ruler: Partial<Ruler>) => {
    dispatch({ type: 'set-ruler', ruler });
  }, []);

  const context: PlotData = useMemo(
    () => ({
      dateScale: state.dateScale,
      xScale: state.xScale,
      yScale: state.yScale,
      transform: state.transform,
      svg,
      yAxisDisplay: state.yAxisDisplay,
      withLine,
      isDragging: state.isDragging,
      ruler: state.ruler,
      setDateScale,
      setXScale,
      setYScale,
      setTransform,
      setSvg,
      setYAxisDisplay,
      setWithLine,
      setDragging,
      setRuler,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, svg, withLine]
  );
  return <PlotContext.Provider value={context}>{children}</PlotContext.Provider>;
};
