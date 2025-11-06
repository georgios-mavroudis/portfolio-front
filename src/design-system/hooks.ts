import { useColorMode } from '@/components/ui/color-mode';
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
        background: PALETTE.common.white,
        mouseLine: PALETTE.grey[400],
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
        background: PALETTE.brand[700],
        mouseLine: PALETTE.grey[100],
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
