const SQUARE_SIZE = 30; // px

export const GRID_UNIT_SIZE = SQUARE_SIZE / 25; // px - the width of a grid line => 1/25 of a square

export const squareToPixel = (squares: number) => squares * SQUARE_SIZE;

export const GRID_MS = 200; // ms

export const GRID_MV = 0.5; // mV
