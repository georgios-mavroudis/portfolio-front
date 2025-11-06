const common = {
  white: '#ffffff',
  black: '#000000',
};

const brand = {
  50: '#E4EAEB',
  100: '#B5D6D8',
  200: '#84C1C5',
  300: '#4FACB0',
  400: '#259EA1',
  500: '#008E8F',
  600: '#008080',
  700: '#0B7271',
  800: '#006361',
  900: '#034643',
};

const red = {
  50: '#FFDFD2',
  100: '#F6BDB6',
  200: '#D99B95',
  300: '#BC7972',
  400: '#A76059',
  500: '#90443F',
  600: '#833C39',
  700: '#712E2E',
  800: '#632328',
  900: '#52151E',
};

const orange = {
  50: '#FFF8EB',
  100: '#FEEAC7',
  200: '#FDD28A',
  300: '#FCBB4D',
  400: '#FBAB24',
  500: '#F59E0B',
  600: '#D98B06',
  700: '#B47409',
  800: '#92610E',
  900: '#78510F',
  950: '#452C03',
};

const green = {
  50: '#DEFCCB',
  100: '#BFECAD',
  200: '#9ED986',
  300: '#8AC975',
  400: '#67BC3F',
  500: '#4FB018',
  600: '#44A20D',
  700: '#358E00',
  800: '#277E00',
  900: '#116000',
};

const grey = {
  50: '#D4D4D4',
  100: '#CFCFCF',
  200: '#C9C9C9',
  300: '#BBBBBB',
  400: '#989898',
  500: '#7C7C7C',
  600: '#555555',
  700: '#424242',
  800: '#252525',
  900: '#000000',
};

const blue = {
  50: '#EBF8FF',
  100: '#BEE3F8',
  200: '#90CDF4',
  300: '#63B3ED',
  400: '#4299E1',
  500: '#3182CE',
  600: '#2B6CB0',
  700: '#2C5282',
  800: '#2A4365',
  900: '#1A365D',
};

const lightBrown = {
  50: '#FCF4ED',
  100: '#F9EADC',
  200: '#F7DFCA',
  300: '#F4D4B8',
  400: '#F1CAA7',
  500: '#EEBF95',
  600: '#ECB483',
  700: '#E9A972',
  800: '#E69F60',
  900: '#E3944F',
};

const disabled = grey[600];

const text = {
  primary: grey[900],
  secondary: grey[50],
};

export const PALETTE = {
  common,
  brand,
  grey,
  red,
  orange,
  blue,
  green,
  text,
  disabled,
  lightBrown,
};

export type Mode = 'light' | 'dark';
