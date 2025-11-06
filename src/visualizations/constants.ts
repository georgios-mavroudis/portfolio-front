import { PALETTE } from '@/design-system/palette';

// PLOT LAYOUT
export const MIN_HR = 0;
export const MAX_HR = 250;
export const SCORE_MAX = 100;
export const GRID_WIDTH = 980;
export const GRID_HEIGHT = 110;
export const PLOT_HEIGHT = 350;
const TIME_SCALES_HEIGHT = 24;
export const SCALE_WIDTH = 44;
export const PLOT_MARGIN = { top: 16, bottom: 16, left: 16, right: 16 };
export const LEFT_OFFSET = SCALE_WIDTH + PLOT_MARGIN.left;
export const SVG_WIDTH = GRID_WIDTH + SCALE_WIDTH + PLOT_MARGIN.left + PLOT_MARGIN.right;
export const SVG_HEIGHT = GRID_HEIGHT + TIME_SCALES_HEIGHT + PLOT_MARGIN.top + PLOT_MARGIN.bottom;
export const SCALE_FACTOR = PLOT_HEIGHT / SVG_HEIGHT;

// Zoom
export const ZOOM_LEVELS_MAP = {
  '60_DAYS': {
    duration: 60,
    scale: 30 / 60,
    ticksInterval1: [2, 'days'],
    ticksInterval2: [1, 'months'],
  },
  '30_DAYS': {
    duration: 30,
    unit: 'days',
    scale: 1,
    ticksInterval1: [1, 'days'],
    ticksInterval2: [1, 'months'],
  },
  '15_DAYS': {
    scale: 30 / 15,
    ticksInterval1: [1, 'days'],
    ticksInterval2: [1, 'months'],
  },
  '7_DAYS': {
    scale: 30 / 7,
    ticksInterval1: [12, 'hours'],
    ticksInterval2: [1, 'days'],
  },
  '4_DAYS': {
    scale: 30 / 4,
    ticksInterval1: [12, 'hours'],
    ticksInterval2: [1, 'days'],
  },
  '2_DAYS': {
    scale: 30 / 2,
    ticksInterval1: [6, 'hours'],
    ticksInterval2: [1, 'days'],
  },
  '24_HOURS': {
    scale: 30,
    ticksInterval1: [3, 'hours'],
    ticksInterval2: [1, 'days'],
  },
  '12_HOURS': {
    scale: 30 / (12 / 24),
    ticksInterval1: [2, 'hours'],
    ticksInterval2: [1, 'days'],
  },
  '6_HOURS': {
    scale: 30 / (6 / 24),
    ticksInterval1: [1, 'hours'],
    ticksInterval2: [1, 'days'],
  },
} as const;

export type ZoomLevel = keyof typeof ZOOM_LEVELS_MAP;

export const MAX_ZOOM_LEVEL: ZoomLevel = '6_HOURS';
export const MIN_ZOOM_LEVEL: ZoomLevel = '60_DAYS';
export const ZOOM_LEVELS = Object.keys(ZOOM_LEVELS_MAP) as ZoomLevel[];

export const closestZoomLevel = (scale: number): ZoomLevel => {
  return ZOOM_LEVELS.find((level) => ZOOM_LEVELS_MAP[level].scale >= scale) ?? MAX_ZOOM_LEVEL;
};

// Heart Rate
export const HIGHLIGHTED_DOT_RADIUS = 3;
export const MINIMAL_DOT_RADIUS = 1;
// SleepScore

// IDs
export const GRID = 'grid';
export const PLOT = 'plot';
export const INTERACTIVE_PLOT = 'interactive_plot';
export const INTERACTIVE_CONTAINER = 'interactive-container';

// Math
export const DEBOUNCE_DURATION_MS = 200;

export type Interval = {
  hours: number;
  minutes: number;
};

type PaletteToken = keyof (typeof PALETTE)['brand'];
export const TOKENS = Object.keys(PALETTE.brand) as unknown as PaletteToken[];
