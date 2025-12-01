import { Box, HStack, Image, Link, VStack } from '@chakra-ui/react';
import tsuga from '@/assets/tsuga.png';
import cardiologs from '@/assets/cardiologs.png';
import maillance from '@/assets/maillance.png';
import akka from '@/assets/akka.png';
import econais from '@/assets/econais.png';
import { useCallback, useMemo, useRef, useState } from 'react';
import ArrowRight from '@/design-system/custom-icons/arrow-right.svg';
import ArrowLeft from '@/design-system/custom-icons/arrow-left.svg';
import { useResizeObserver } from '@/visualizations/graph-hooks';
import { clamp } from '@/common/helpers';

type Experience = {
  png: string;
  link: string;
};

const SCROLL = 600;

const EXPERIENCES: Experience[] = [
  {
    png: tsuga,
    link: 'https://www.tsuga.com/',
  },
  {
    png: cardiologs,
    link: 'https://www.philips.co.uk/healthcare/ambulatory-monitoring-and-diagnostics/ecg-monitoring/cardiologs-ecg-analysis',
  },
  {
    png: maillance,
    link: 'https://oilfield.ai/',
  },
  {
    png: akka,
    link: 'https://www.akkodis.com/',
  },
  {
    png: econais,
    link: 'https://econais.com/',
  },
];
export const Experience = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [scrollingBehaviour, setScrollingBehaviour] = useState<'start' | 'end' | null>('start');
  const { ref, width } = useResizeObserver();
  const scroll = useCallback(
    (offset: number) => {
      const slider = sliderRef.current;
      if (slider) {
        console.log('sdf');
        const sliding = slider.scrollLeft + offset;
        if (sliding <= 0 && scrollingBehaviour !== 'start') {
          setScrollingBehaviour('start');
        } else if (
          sliding + slider.clientWidth > slider.scrollWidth &&
          scrollingBehaviour !== 'end'
        ) {
          setScrollingBehaviour('end');
        } else if (scrollingBehaviour !== null) {
          setScrollingBehaviour(null);
        }
        slider.scrollLeft += offset;
      }
    },
    [scrollingBehaviour]
  );

  const scrollAmount = useMemo(() => clamp(width, width, SCROLL), [width]);
  return (
    <>
      <Box ref={ref} width="50%" position="relative" overflow="hidden" alignItems="center">
        <HStack
          width="full"
          ref={sliderRef}
          overflowX="scroll"
          scrollBehavior="smooth"
          scrollbarWidth="none"
          maskImage={`linear-gradient(to right, transparent 0%, black ${scrollingBehaviour !== 'start' ? '10' : '0'}%, black ${scrollingBehaviour !== 'end' ? '90' : '100'}%, transparent 100%)`}
        >
          {EXPERIENCES.map(({ png, link }) => (
            <Link
              key={link}
              href={link}
              target="_blank"
              style={{
                borderColor: 'border.primary',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            >
              <Image
                src={png}
                rounded="md"
                border="md"
                borderColor="border.primary"
                objectFit="cover"
                flexShrink={0}
              />
            </Link>
          ))}
        </HStack>
        {scrollingBehaviour !== 'start' && (
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
            onClick={() => scroll(-scrollAmount)}
            maskImage="linear-gradient(to right, transparent 0%, black 0%, black 70%, transparent 100%)"
          >
            <VStack justifyContent="center" padding="sm">
              <Image src={ArrowLeft} />
            </VStack>
          </Box>
        )}
        {scrollingBehaviour !== 'end' && (
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
            onClick={() => scroll(scrollAmount)}
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
