export type Interval = {
  hours: number;
  minutes: number;
};

export interface Data {
  id: number;
  bedTime: Date;
  wakeTime: Date;
  score: number;
  meanHr: number;
  duration: Interval;
}
