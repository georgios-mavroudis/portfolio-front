import { useColorMode } from '@/design-system/components/color-mode';
import { PALETTE } from '@/design-system/palette';

/**
 * A function to return colors for svg
 * components corresponding to
 * the color mode (light / dark)
 */
export const useGraphColors = () => {
  const { colorMode } = useColorMode();

  return colorMode === 'light'
    ? {
        text: PALETTE.grey[500],
        lightText: PALETTE.grey[400],
        contrastText: PALETTE.common.black,
        background: PALETTE.common.white,
        mouseLine: PALETTE.grey[400],
        stockData: {
          win: PALETTE.green[600],
          loss: PALETTE.red[400],
          stale: PALETTE.grey[600],
          barBorderWin: PALETTE.green[900],
          barBorderLoss: PALETTE.red[900],
        },
        heartBeat: {
          strip: PALETTE.common.black,
          ruler: PALETTE.grey[100],
          rulerBorder: PALETTE.common.black,
        },
        sleepData: {
          sleepScorePalette: PALETTE.brand,
          wokeTime: PALETTE.orange[400],
          bedTime: PALETTE.brand[500],
          hrLine: PALETTE.brand[300],
          hrPoint: PALETTE.brand[800],
        },
      }
    : {
        text: PALETTE.common.white,
        lightText: PALETTE.common.white,
        contrastText: PALETTE.common.white,
        background: PALETTE.brand[700],
        mouseLine: PALETTE.common.white,
        stockData: {
          win: PALETTE.green[200],
          loss: PALETTE.red[200],
          stale: PALETTE.grey[200],
          barBorderWin: PALETTE.green[900],
          barBorderLoss: PALETTE.red[900],
        },
        heartBeat: {
          strip: PALETTE.green[100],
          ruler: PALETTE.red[300],
          rulerBorder: PALETTE.red[50],
        },
        sleepData: {
          sleepScorePalette: PALETTE.lightBrown,
          wokeTime: PALETTE.brand[100],
          bedTime: PALETTE.lightBrown[900],
          hrLine: PALETTE.red[200],
          hrPoint: PALETTE.lightBrown[500],
        },
      };
};
