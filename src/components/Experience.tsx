import { Box, HStack, Image, Link, VStack } from '@chakra-ui/react';
import tsuga from '@/assets/tsuga.webp';
import cardiologs from '@/assets/cardiologs.webp';
import maillance from '@/assets/maillance.webp';
import akka from '@/assets/akka.webp';
import econais from '@/assets/econais.webp';
import { createRef, useCallback, useRef, useState, type RefObject } from 'react';
import ArrowRight from '@/design-system/custom-icons/arrow-right.svg';
import ArrowLeft from '@/design-system/custom-icons/arrow-left.svg';
import { clamp } from '@/common/helpers';
import { useThemeBreakpointValue, type BreakpointKey } from '@/design-system/tokens/breakpoints';

type Experience = {
  ref: RefObject<HTMLAnchorElement | null>;
  png: string;
  link: string;
};

const BREAKPOINT_TO_WIDTH_MAPPING: Record<BreakpointKey, string> = {
  base: '80%',
  sm: '70%',
  md: '60%',
  lg: '50%',
  xl: '50%',
  '2xl': '50%',
};

const EXPERIENCES: Experience[] = [
  {
    ref: createRef(),
    png: tsuga,
    link: 'https://www.tsuga.com/',
  },
  {
    ref: createRef(),
    png: cardiologs,
    link: 'https://www.philips.co.uk/healthcare/ambulatory-monitoring-and-diagnostics/ecg-monitoring/cardiologs-ecg-analysis',
  },
  {
    ref: createRef(),
    png: maillance,
    link: 'https://oilfield.ai/',
  },
  {
    ref: createRef(),
    png: akka,
    link: 'https://www.akkodis.com/',
  },
  {
    ref: createRef(),
    png: econais,
    link: 'https://econais.com/',
  },
];

const getOutOfViewElementIndex = (idx: number, direction: 1 | -1, container: HTMLDivElement) => {
  const index = clamp(idx, 0, EXPERIENCES.length - 1);
  const item = EXPERIENCES[index].ref;
  if (!item.current) {
    return idx;
  }
  const el = item.current;
  const { width, left } = el.getBoundingClientRect();
  const { width: containerWidth, left: containerLeft } = container.getBoundingClientRect();
  const visibility = left > containerLeft && left + width < containerLeft + containerWidth;
  if (visibility) {
    return getOutOfViewElementIndex(index + direction, direction, container);
  }
  return index;
};

export const Experience = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const breakpointValue = useThemeBreakpointValue();
  const [scrollIndex, setScrollIndex] = useState(0);

  const scroll = useCallback(
    (scroll: number) => {
      if (!sliderRef.current) {
        return;
      }
      const index = getOutOfViewElementIndex(
        scroll + scrollIndex,
        Math.sign(scroll) as 1 | -1,
        sliderRef.current
      );

      const item = EXPERIENCES[index];
      const el = item.ref.current;

      if (el) {
        el.scrollIntoView();
        setScrollIndex(index);
      }
    },
    [scrollIndex]
  );

  return (
    <>
      <Box
        width={BREAKPOINT_TO_WIDTH_MAPPING[breakpointValue]}
        position="relative"
        overflow="hidden"
        alignItems="center"
      >
        <HStack
          width="full"
          ref={sliderRef}
          gap="xl"
          overflowX="scroll"
          scrollBehavior="smooth"
          scrollbarWidth="none"
          maskImage={`linear-gradient(to right, transparent 0%, black ${scrollIndex !== 0 ? '10' : '0'}%, black ${scrollIndex !== EXPERIENCES.length - 1 ? '90' : '100'}%, transparent 100%)`}
        >
          {EXPERIENCES.map(({ png, link, ref: expRef }, idx) => (
            <Link
              ref={expRef}
              data-index={idx}
              key={link}
              href={link}
              target="_blank"
              minHeight={70}
              objectFit="cover"
              flexShrink={0}
            >
              <Image src={png} alt={link} objectFit="cover" flexShrink={0} loading="lazy" />
            </Link>
          ))}
        </HStack>
        {scrollIndex !== 0 && (
          <Box
            position="absolute"
            left={0}
            height="full"
            width={50}
            top={0}
            rounded="md"
            display="flex"
            justifyContent="center"
            _hover={{
              bg: 'background.primary-hover',
            }}
            opacity={0.7}
            cursor="pointer"
            onClick={() => scroll(-1)}
            maskImage="linear-gradient(to right, transparent 0%, black 0%, black 70%, transparent 100%)"
          >
            <VStack justifyContent="center" padding="sm">
              <Image src={ArrowLeft} />
            </VStack>
          </Box>
        )}
        {scrollIndex !== EXPERIENCES.length - 1 && (
          <Box
            position="absolute"
            right={0}
            height="full"
            width={50}
            top={0}
            rounded="md"
            display="flex"
            justifyContent="center"
            _hover={{
              bg: 'background.primary-hover',
            }}
            opacity={0.7}
            cursor="pointer"
            onClick={() => scroll(1)}
            maskImage="linear-gradient(to left, transparent 0%, black 0%, black 70%, transparent 100%)"
          >
            <VStack justifyContent="center" padding="sm">
              <Image src={ArrowRight} />
            </VStack>
          </Box>
        )}
      </Box>
    </>
  );
};
