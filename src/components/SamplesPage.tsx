import { Card, Image, Skeleton, Stack, Text, VStack } from '@chakra-ui/react';
import { RouterLink, type Route } from '@/design-system/components/RouterLink';
import { useTranslation } from 'react-i18next';
import garminData from '@/assets/garmin_data.webp';
import hrAnalysis from '@/assets/hr_analysis.webp';
import heart3D from '@/assets/heart_3D.webp';
import kittyRun from '@/assets/kitty_run.webp';
import scatterPlot from '@/assets/scatter_plot.webp';
import webGLInteractions from '@/assets/web-gl_interactions.webp';
import stockData from '@/assets/stock_data.webp';
import unrealDemo from '@/assets/unreal_game.webp';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

type Category = 'react' | 'threejs' | 'unreal';

type Sample = {
  title: string;
  description: string;
  img: string;
  link: Route;
};
const REACT_SAMPLES: Sample[] = [
  {
    title: 'HEARTBEAT_ANALYSIS.TITLE',
    description: 'HEARTBEAT_ANALYSIS.DESCRIPTION',
    img: hrAnalysis,
    link: '/heartbeat-analysis',
  },
  {
    title: 'GARMIN_SLEEP_DATA.TITLE',
    description: 'GARMIN_SLEEP_DATA.DESCRIPTION',
    img: garminData,
    link: '/garmin-sleep-data',
  },
  {
    title: 'STOCK_DATA.TITLE',
    description: 'STOCK_DATA.DESCRIPTION',
    img: stockData,
    link: '/stock-data',
  },
  {
    title: 'SCALED_SCATTER_PLOT.TITLE',
    description: 'SCALED_SCATTER_PLOT.DESCRIPTION',
    img: scatterPlot,
    link: '/scaled-scatter-plot',
  },
  {
    title: 'F_SHAPE.TITLE',
    description: 'F_SHAPE.DESCRIPTION',
    img: webGLInteractions,
    link: '/f-shape',
  },
];

const THREEJS_SAMPLES: Sample[] = [
  {
    title: 'HEART_3D.TITLE',
    description: 'HEART_3D.DESCRIPTION',
    img: heart3D,
    link: '/heart-3d',
  },
  {
    title: 'GAME.TITLE',
    description: 'GAME.DESCRIPTION',
    img: kittyRun,
    link: '/kitty-run',
  },
];

const UNREAL_SAMPLES: Sample[] = [
  {
    title: 'SAVANNA_PROJECT.TITLE',
    description: 'SAVANNA_PROJECT.DESCRIPTION',
    link: '/savanna-project',
    img: unrealDemo,
  },
];

const CATEGORIES: { id: Category; labelKey: string; samples: Sample[] }[] = [
  { id: 'react', labelKey: 'SAMPLES.REACT_TITLE', samples: REACT_SAMPLES },
  { id: 'threejs', labelKey: 'SAMPLES.THREEJS_TITLE', samples: THREEJS_SAMPLES },
  { id: 'unreal', labelKey: 'SAMPLES.UNREAL_TITLE', samples: UNREAL_SAMPLES },
];

export const SamplesPage = () => {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { category: initialCategory } = useSearch({ from: '/samples' });
  const sectionRefs = useRef<Record<Category, HTMLDivElement | null>>({
    react: null,
    threejs: null,
    unreal: null,
  });
  const scrollingToRef = useRef(false);

  // On mount, if a category param exists, scroll to that section
  useEffect(() => {
    if (!initialCategory) return;
    const el = sectionRefs.current[initialCategory];
    if (!el) return;
    scrollingToRef.current = true;
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => {
      scrollingToRef.current = false;
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Observe which section's top edge enters the upper third of the viewport
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    CATEGORIES.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !scrollingToRef.current) {
            navigate({
              from: '/samples',
              search: (prev) => ({ ...prev, category: id }),
              replace: true,
            });
          }
        },
        // fire when the top edge of the section crosses into the top third of the viewport
        { threshold: 0, rootMargin: '0px 0px -66% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [navigate]);

  return (
    <VStack alignItems={{ base: 'center', sm: 'center', md: 'start' }} gap={60} pb="100vh">
      {CATEGORIES.map(({ id, labelKey, samples }) => (
        <VStack
          key={id}
          ref={(el) => {
            sectionRefs.current[id] = el;
          }}
          alignItems={{ base: 'center', sm: 'center', md: 'start' }}
          gap="lg"
          width="full"
        >
          <Text textStyle="h3">{t(labelKey)}</Text>
          <Stack
            direction={{ base: 'column', sm: 'column', md: 'row' }}
            width="full"
            flexWrap="wrap"
            gap="lg"
            height="full"
            alignItems={{ base: 'center', sm: 'center', md: 'start' }}
          >
            {samples.length === 0 ? (
              <Text color="fg.muted">{t('SAMPLES.COMING_SOON')}</Text>
            ) : (
              samples.map((sample, idx) => (
                <RouterLink to={sample.link} key={sample.link}>
                  <Card.Root width="320px" boxShadow="lg">
                    <Card.Body gap="2">
                      <Skeleton loading={!loaded} width="full" minHeight={110}>
                        <Image
                          src={sample.img}
                          alt={t(sample.title)}
                          width="full"
                          border="sm"
                          borderColor="border.primary"
                          onLoad={() => {
                            if (idx === samples.length - 1) setLoaded(true);
                          }}
                        />
                      </Skeleton>
                      <Card.Title mt="2">{t(sample.title)}</Card.Title>
                      <Card.Description>{t(sample.description)}</Card.Description>
                    </Card.Body>
                  </Card.Root>
                </RouterLink>
              ))
            )}
          </Stack>
        </VStack>
      ))}
    </VStack>
  );
};
