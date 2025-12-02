import { ticks } from 'd3-array';
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isBefore,
  startOfDay,
  startOfMonth,
  subDays,
  subHours,
  subMilliseconds,
  subMinutes,
  subMonths,
  type Locale,
} from 'date-fns';
import {
  INTERACTIVE_CONTAINER,
  INTERACTIVE_PLOT,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
  ZOOM_LEVELS_MAP,
  GRID_HEIGHT,
  GRID_WIDTH,
  MAX_HR,
  MIN_HR,
  type ZoomLevel,
  SCORE_MAX,
  type Interval,
  TOKENS,
  SVG_WIDTH,
  RESPONSIVE_FONTSIZES,
} from '@/visualizations/constants';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { type BaseType, pointer, select, type Selection } from 'd3-selection';
import { type D3ZoomEvent, zoom } from 'd3-zoom';
import { timeFormat, timeFormatLocale, type TimeLocaleDefinition } from 'd3-time-format';
import enJson from 'd3-time-format/locale/en-US';
import frJson from 'd3-time-format/locale/fr-FR';
import { SLEEP_SCORE, type YAxisDisplay } from '@/components/SleepData/constants';
import { timeDay, timeHour, type TimeInterval, timeMonth } from 'd3-time';
import { PALETTE } from '@/design-system/palette';
import { scaleLinear, scaleUtc, type ScaleLinear, type ScaleTime } from 'd3-scale';
import type { PlotData } from './components/PlotContext';
import { enUS, fr } from 'date-fns/locale';
import { useThemeBreakpointValue } from '@/design-system/tokens/breakpoints';

// Plot
export const PlotContext = createContext<PlotData | null>(null);

export const usePlot = () => {
  const context = useContext<PlotData | null>(PlotContext);
  if (context === null) {
    throw new Error('usePlot must be inside <PlotContext />');
  }

  return context;
};

// Scales
const INITIAL_ZOOM = ZOOM_LEVELS_MAP['60_DAYS'];

const getInitialDateRange = () => {
  const today = new Date();
  const start = subDays(today, INITIAL_ZOOM.duration - 15);
  const end = addDays(today, 15);

  return [start, end];
};

export const getInitialXScale = () => scaleLinear().domain([0, 1200]).range([0, GRID_WIDTH]);

export const getInitialDateScale = (width = SVG_WIDTH) =>
  scaleUtc().domain(getInitialDateRange()).range([0, width]);

export const getInitialYScale = (
  yAxisDisplay: YAxisDisplay = 'Sleep Score',
  height = GRID_HEIGHT
) =>
  yAxisDisplay === SLEEP_SCORE
    ? scaleLinear().domain([0, SCORE_MAX]).range([0, height]).clamp(true)
    : scaleLinear().domain([MIN_HR, MAX_HR]).range([0, height]).clamp(true);

export const useYTicks = () => {
  const {
    yScale,
    dimensions: { height },
  } = usePlot();
  return useMemo(() => {
    const reversedYScale = yScale.copy().range([height, 0]);
    return ticks(reversedYScale.domain()[0], reversedYScale.domain()[1], 5).map((t) =>
      reversedYScale(t)
    );
  }, [yScale, height]);
};

// Interactions
export const useZoomAndPan = () => {
  const {
    setDateScale,
    transform,
    setTransform,
    dimensions: { width },
  } = usePlot();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const initialDateScale = useMemo(() => getInitialDateScale(width), [width]);

  const onMouseActive = useCallback((event: MouseEvent) => {
    const [x, y] = pointer(event);
    setMouseX(x);
    setMouseY(y);
  }, []);

  const onMouseLeave = useCallback(() => {
    setMouseX(null);
    setMouseY(null);
  }, [setMouseX]);

  // change the scale everytime the transform changes
  useEffect(() => {
    setDateScale(transform.rescaleX(initialDateScale));
  }, [setDateScale, initialDateScale, transform]);

  useEffect(() => {
    select(`#${INTERACTIVE_CONTAINER}`)
      ?.on('mouseenter', onMouseActive)
      ?.on('mousemove', onMouseActive);

    select(`#${INTERACTIVE_PLOT}`).on('mouseleave', onMouseLeave);

    // remove zoom handles on unmount
    return () => {
      select('.zoom')?.on('zoom', null)?.on('start', null)?.on('end', null);
    };
  }, [onMouseActive, onMouseLeave]);

  const zoomAndPan = useMemo(() => {
    const zoomAndPan = zoom()
      .scaleExtent([ZOOM_LEVELS_MAP[MIN_ZOOM_LEVEL].scale, ZOOM_LEVELS_MAP[MAX_ZOOM_LEVEL].scale])
      .on('start', (e: D3ZoomEvent<SVGSVGElement, number>) => {
        e?.sourceEvent?.preventDefault();
        e?.sourceEvent?.stopPropagation();
        switch (e?.sourceEvent?.type) {
          case 'wheel':
            setIsDragging(false);
            break;
          default:
            setIsDragging(true);
            break;
        }
      })
      .on('end', () => {
        setIsDragging(false);
      })
      .on('zoom', (e: D3ZoomEvent<SVGSVGElement, number>) => {
        e?.sourceEvent?.preventDefault();
        e?.sourceEvent?.stopPropagation();

        setTransform(e.transform);
      });

    return zoomAndPan;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    select(`#${INTERACTIVE_CONTAINER}`)?.call(
      zoomAndPan as (selection: Selection<BaseType, unknown, HTMLElement, unknown>) => void
    );
  }, [zoomAndPan]);

  return {
    mouseY,
    mouseX,
    isDragging,
  };
};

export const TIME_FORMAT_LOCALE_MAPPING: Record<string, TimeLocaleDefinition> = {
  en: enJson as TimeLocaleDefinition,
  fr: frJson as TimeLocaleDefinition,
};

// Date Axises
export const getVisibleDays = (
  start: Date,
  end: Date,
  dateScale: ScaleTime<number, number>,
  language: string
) => {
  const days = [];
  const timeFormat = timeFormatLocale(TIME_FORMAT_LOCALE_MAPPING[language] || enJson);
  const format = timeFormat.format('%A %d');
  let current = startOfDay(start);
  while (isBefore(current, end)) {
    const firstHourOfDay = startOfDay(current);
    const firstVisibleDay = firstHourOfDay > start && firstHourOfDay < end ? firstHourOfDay : start;
    days.push({
      name: format(firstVisibleDay),
      date: firstVisibleDay,
    });
    current = addDays(current, 1);
  }

  if (days.length >= 2) {
    const [firstDay, secondDay] = days;
    firstDay.date = slideTicks(firstDay.date, secondDay.date, dateScale);
  }

  return days;
};

export const LOCALE_MAPPING: Record<string, Locale> = {
  en: enUS,
  fr: fr,
};
export const getVisibleMonths = (
  start: Date,
  end: Date,
  dateScale: ScaleTime<number, number>,
  language: string,
  prefetchPadding = 0
) => {
  const months = [];
  if (Number.isNaN(prefetchPadding)) {
    prefetchPadding = 0;
  }

  const startWithPadding = subMonths(start, prefetchPadding);
  const endWithPadding = addMonths(end, prefetchPadding);
  let current = startOfMonth(startWithPadding);

  while (isBefore(current, endWithPadding)) {
    const firstDayOfMonth = startOfMonth(current);
    const lastDayOfMonth = endOfMonth(current);
    const monthName = format(current, 'MMMM', {
      locale: LOCALE_MAPPING[language] || enUS,
    });
    const firstVisibleMonthDay =
      firstDayOfMonth > startWithPadding && firstDayOfMonth < endWithPadding
        ? firstDayOfMonth
        : startWithPadding;

    months.push({
      name: monthName,
      date: firstVisibleMonthDay,
      isPrefetched: firstDayOfMonth < start || lastDayOfMonth > end,
    });

    current = addMonths(current, 1);
  }

  if (dateScale != null && months.length >= 2) {
    const [firstMonth, secondMonth] = months;
    const separator = secondMonth.date;
    firstMonth.date = slideTicks(firstMonth.date, separator, dateScale);
  }

  return months;
};

// Slide a month label to the left to make room for the next one
const slideTicks = (first: Date, second: Date, dateScale: ScaleTime<number, number>) => {
  const TICK_SLIDING_OFFSET = 60;
  const dist = dateScale(second) - dateScale(first);
  if (dist < TICK_SLIDING_OFFSET) {
    const deltaT = dateScale.invert(TICK_SLIDING_OFFSET).getTime() - dateScale.invert(0).getTime();
    return subMilliseconds(second, deltaT);
  }

  return first;
};

export const addInterval = (date: Date, duration: Interval) => {
  return subHours(subMinutes(date, duration.minutes ?? 0), duration.hours ?? 0);
};

export const tickInterval = (
  duration: number,
  unit: (typeof ZOOM_LEVELS_MAP)[ZoomLevel][`ticksInterval${1 | 2}`][1]
): [TimeInterval | null, (date: Date) => string] => {
  switch (unit) {
    case 'months':
      return [timeMonth.every(duration), timeFormat('%B')];
    case 'days':
      return [timeDay.every(duration), timeFormat('%d')];
    case 'hours':
      return [timeHour.every(duration), timeFormat('%I %p')];
    default:
      return [null, timeFormat('%d')];
  }
};

export const getBottomTicks = (
  startDate: Date,
  endDate: Date,
  unit: 'months' | 'days',
  dateScale: ScaleTime<number, number>,
  language: string
) => {
  return (unit === 'months' ? getVisibleMonths : getVisibleDays)(
    startDate,
    endDate,
    dateScale,
    language
  );
};

// A color palette to represent the duration of sleep
export const getSleepDurationPalette = (
  duration: Interval,
  palette: Record<keyof (typeof PALETTE)['brand'], string>
) => {
  // round up the minutes to either .5 if > 30 mins or 0 if < 30mins
  const minutes = duration.minutes ? Math.floor(duration.minutes / 30) : 0;
  const total = duration.hours ? duration.hours + minutes : minutes;

  const length = TOKENS.length; // We dont use the 800 and 900 shades of the palette and we keep the 800 for default returned value at the end
  for (let i = 2; i < length - 1; i++) {
    // we add 3 because the first color starts at "< 3 hours"
    if (total <= i + 1) {
      return palette[TOKENS[i]];
    }
  }
  // we dont check the last item as this covers if the total is 12+ hours
  return palette['900'];
};

interface Scope {
  start?: number;
  end: number;
}

interface Props {
  domain: Scope;
  range: Scope;
}

export const useScale = ({
  domain: { start: domainStart = 0, end: domainEnd },
  range: { start: rangeStart = 0, end: rangeEnd },
}: Props): ScaleLinear<number, number> =>
  useMemo(
    () => scaleLinear().domain([domainStart, domainEnd]).range([rangeStart, rangeEnd]),
    [domainStart, domainEnd, rangeStart, rangeEnd]
  );

export function useResizeObserver<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}

export const useResponsiveFont = () => {
  const breakpointSize = useThemeBreakpointValue();

  return useMemo(() => RESPONSIVE_FONTSIZES[breakpointSize], [breakpointSize]);
};
