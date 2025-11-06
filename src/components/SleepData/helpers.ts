import { addInterval } from '@/visualizations/graph-hooks';
import type { Interval } from '@/visualizations/constants';
import { addMilliseconds, differenceInMilliseconds } from 'date-fns';

// We get the middle time in the sleep duration
export const findMiddlePoint = (wakeTime: Date, duration: Interval) => {
  const sleepTime = addInterval(wakeTime, duration);
  return addMilliseconds(sleepTime, differenceInMilliseconds(wakeTime, sleepTime) / 2);
};
