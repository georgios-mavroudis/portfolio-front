import { useMemo } from 'react';
import './Lava.css';
import { useColorMode } from '@/design-system/components/color-mode';
import { PALETTE } from '@/design-system/palette';

export type GooeyLavaBackgroundProps = {
  count?: number;
  opacity?: number;
  blur?: number;
  speedRange?: [number, number];
  respectReducedMotion?: boolean;
  zIndex?: number;
};

const rand = (min: number, max: number, i: number) => {
  // Simple deterministic pseudo-random based on index so SSR/CSR match
  const x = Math.sin(i * 9999.1337) * 43758.5453;
  const t = x - Math.floor(x);
  return min + (max - min) * t;
};

export const LavaBackground = ({
  count = 8,
  opacity = 0.6,
  blur = 28,
  speedRange = [18, 36],
  zIndex = 0,
}: GooeyLavaBackgroundProps) => {
  const { colorMode } = useColorMode();
  const palette = useMemo(
    () =>
      colorMode === 'light'
        ? [PALETTE.brand[100], PALETTE.brand[200], PALETTE.brand[300], PALETTE.brand[50]]
        : [PALETTE.brand[500], PALETTE.brand[600], PALETTE.brand[900], PALETTE.brand[700]],
    [colorMode]
  );

  const blobs = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const size = rand(18, 36, i); // vw
      const left = rand(-10, 90, i + 1);
      const top = rand(-10, 90, i + 2);
      const hue = palette[i % palette.length];
      const dur = rand(speedRange[0], speedRange[1], i + 3);
      const delay = -rand(0, speedRange[1], i + 4); // negative to desync
      const xAmp = rand(20, 45, i + 5); // vw
      const yAmp = rand(20, 45, i + 6); // vh
      const rotate = rand(0, 360, i + 7);
      const borderRadius = `${rand(35, 50, i + 8)}% ${rand(35, 50, i + 9)}% ${rand(35, 50, i + 10)}% ${rand(35, 50, i + 11)}% / ${rand(35, 50, i + 12)}% ${rand(35, 50, i + 13)}% ${rand(35, 50, i + 14)}% ${rand(35, 50, i + 15)}%`;
      return { size, left, top, hue, dur, delay, xAmp, yAmp, rotate, borderRadius };
    });
  }, [count, palette, speedRange]);
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex,
        minHeight: '100vh',
      }}
    >
      <svg width="0" height="100%" style={{ position: 'absolute' }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur / 10} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="gooey-field" style={{ filter: 'url(#gooey)', width: '100%', height: '100%' }}>
        {blobs.map((b, i) => (
          <div
            key={i}
            className="gooey-blob"
            style={{
              position: 'absolute',
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.size}vw`,
              height: `${b.size}vw`,
              background: b.hue,
              opacity,
              borderRadius: b.borderRadius,
              transform: `translate(-50%, -50%) rotate(${b.rotate}deg)`,
              animation: `blobFloat ${b.dur}s ease-in-out ${b.delay}s infinite both`,
              willChange: 'transform',
              boxShadow: `0 0 ${Math.max(8, blur)}px ${Math.max(4, blur / 2)}px ${b.hue}`,
              mixBlendMode: 'screen',
            }}
          />
        ))}
      </div>
    </div>
  );
};
