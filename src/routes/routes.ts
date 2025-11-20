import App from '@/App';
import { SleepData } from '@/components/SleepData/SleepData';
import { createRootRoute, createRoute } from '@tanstack/react-router';
import { NotFound } from './NotFound';
import { HomePage } from '@/components/HomePage';
import { ScaledScatterPage } from '@/components/ScaledScatterPlot/ScaledScatterPage';
import { FShape } from '@/components/FShape/FShape';
import { HeartBeatAnalysis } from '@/components/Heartbeart-analysis/HeartbeatAnalysis';
import { StockData } from '@/components/Financial-data/StockData';
import { Heart3D } from '@/components/heart-3D/Heart3D';
import { SamplesPage } from '@/components/SamplesPage';

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFound,
});

const homePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const sleepDataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/garmin-sleep-data',
  component: SleepData,
});

const scaledScatterPlotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scaled-scatter-plot',
  component: ScaledScatterPage,
});

const fShapeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/f-shape',
  component: FShape,
});

const heartbeatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/heartbeat-analysis',
  component: HeartBeatAnalysis,
});

const StockDataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stock-data',
  component: StockData,
});

const Heart3DRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/heart-3d',
  component: Heart3D,
});

const SamplesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples',
  component: SamplesPage,
});

export const RouteTree = rootRoute.addChildren([
  homePageRoute,
  sleepDataRoute,
  scaledScatterPlotRoute,
  fShapeRoute,
  heartbeatRoute,
  StockDataRoute,
  Heart3DRoute,
  SamplesRoute,
]);
