import { Button, Image, Menu, Portal, Text } from '@chakra-ui/react';
import { RouterLink } from '@/design-system/components/RouterLink';
import { Drawer, HStack, Stack, useDisclosure, VStack } from '@chakra-ui/react';
import { Menu01 } from '@untitled-ui/icons-react';
import { useMemo, type FC } from 'react';
import { ColorModeButton } from '@/design-system/components/color-mode';
import { Logo } from '@/design-system/custom-icons/Logo';
import en from '@/design-system/custom-icons/en.svg';
import fr from '@/design-system/custom-icons/fr.svg';
import { useTranslation } from 'react-i18next';

const LANGUAGE_SVG_MAPPING: Record<string, string> = {
  en,
  fr,
};
export const Header: FC = () => {
  const { open, onToggle, onClose } = useDisclosure();
  const { t, i18n } = useTranslation();
  const langIcon = useMemo(() => LANGUAGE_SVG_MAPPING[i18n.language] || en, [i18n.language]);
  return (
    <Stack as="header" width="full" p="md" boxShadow="md" bg="background.primary">
      <HStack justifyContent="space-between">
        <HStack position="relative">
          <Logo />
        </HStack>
        <HStack>
          <Menu.Root onSelect={(d) => i18n.changeLanguage(d.value)}>
            <Menu.Trigger asChild>
              <Button variant="tertiary" size="sm">
                <Image src={langIcon} />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minWidth={14}>
                  <Menu.Item value="en" justifyContent="center">
                    <Image src={en} />
                  </Menu.Item>
                  <Menu.Item value="fr" justifyContent="center">
                    <Image src={fr} />
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <ColorModeButton bg="foreground.primary" color="background.primary" />
          <Drawer.Root open={open} onOpenChange={onToggle}>
            <Drawer.Trigger asChild>
              <Button size="sm">
                <Menu01 />
              </Button>
            </Drawer.Trigger>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <VStack alignItems="start">
                    <Drawer.Title>
                      <Text textStyle="title">{t('SAMPLES.TITLE')}</Text>
                    </Drawer.Title>
                    <Text textStyle="xs">{t('SAMPLES.DESCRIPTION')}</Text>
                  </VStack>
                </Drawer.Header>
                <Drawer.Body>
                  <VStack alignItems="start" gap="md">
                    <RouterLink to="/heartbeat-analysis" onClick={onClose}>
                      {t('HEARTBEAT_ANALYSIS.TITLE')}
                    </RouterLink>
                    <RouterLink to="/garmin-sleep-data" onClick={onClose}>
                      {t('STOCK_DATA.TITLE')}
                    </RouterLink>
                    <RouterLink to="/scaled-scatter-plot" onClick={onClose}>
                      {t('SCALED_SCATTER_PLOT.TITLE')}
                    </RouterLink>
                    <RouterLink to="/f-shape" onClick={onClose}>
                      {t('F_SHAPE.TITLE')}
                    </RouterLink>
                    <RouterLink to="/stock-data" onClick={onClose}>
                      {t('STOCK_DATA.TITLE')}
                    </RouterLink>
                    <RouterLink to="/heart-3d" onClick={onClose}>
                      Heart 3D
                    </RouterLink>
                    <Text textStyle="xs" mt="md">
                      {t('SAMPLES.POSTSCRIPT')}
                    </Text>
                  </VStack>
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Drawer.Root>
        </HStack>
      </HStack>
    </Stack>
  );
};
