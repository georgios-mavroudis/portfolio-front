import App from '@/App';
import { SleepData } from '@/components/SleepData/SleepData';
import { createRootRoute, createRoute } from '@tanstack/react-router';
import { NotFound } from './NotFound';
import { HomePage } from '@/components/HomePage';
import { ScaledScatterPage } from '@/components/ScaledScatterPlot/ScaledScatterPage';
import { FShape } from '@/components/FShape/FShape';
import { HeartBeatAnalysis } from '@/components/Heartbeart-analysis/Analysis';

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
  path: '/sleep-data',
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

export const RouteTree = rootRoute.addChildren([
  homePageRoute,
  sleepDataRoute,
  scaledScatterPlotRoute,
  fShapeRoute,
  heartbeatRoute,
]);
