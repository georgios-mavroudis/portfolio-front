export const CONTROLS = {
  crouch: 'crouch',
  jump: 'jump',
  run: 'run',
};

type Keys = keyof typeof CONTROLS;
export type Control = (typeof CONTROLS)[Keys];
