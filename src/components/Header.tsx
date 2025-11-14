import { Button, Image, Menu, Portal } from '@chakra-ui/react';
import { RouterLink } from '@/design-system/components/RouterLink';
import { Drawer, HStack, Stack, useDisclosure, VStack } from '@chakra-ui/react';
import { Menu01 } from '@untitled-ui/icons-react';
import { useState, type FC } from 'react';
import { ColorModeButton } from '@/design-system/components/color-mode';
import { Logo } from '@/design-system/custom-icons/Logo';
import en from '@/design-system/custom-icons/en.svg';
import fr from '@/design-system/custom-icons/fr.svg';
import i18n from '@/i18n/i18n';

const LANGUAGE_MAPPING: Record<string, string> = {
  en,
  fr,
};
export const Header: FC = () => {
  const { open, onToggle, onClose } = useDisclosure();
  const [langIcon, setLangIcon] = useState(LANGUAGE_MAPPING[i18n.language] || en);
  return (
    <Stack as="header" width="full" p={4} boxShadow="md" bg="background.primary">
      <HStack justifyContent="space-between">
        <HStack position="relative">
          <Logo />
        </HStack>
        <HStack>
          <Menu.Root
            onSelect={(d) => {
              setLangIcon(LANGUAGE_MAPPING[d.value]);
              i18n.changeLanguage(d.value);
            }}
          >
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
          <Button size="sm">Contact</Button>
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
                  <Drawer.Title>Projects</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <VStack alignItems="start">
                    <RouterLink to="/heartbeat-analysis" onClick={onClose}>
                      Heartbeat Analysis
                    </RouterLink>
                    <RouterLink to="/garmin-sleep-data" onClick={onClose}>
                      Garmin Sleep Data
                    </RouterLink>
                    <RouterLink to="/scaled-scatter-plot" onClick={onClose}>
                      Scaled Scatter Plot
                    </RouterLink>
                    <RouterLink to="/f-shape" onClick={onClose}>
                      WebGL testing
                    </RouterLink>
                    <RouterLink to="/stock-data" onClick={onClose}>
                      Stock Data
                    </RouterLink>
                    <RouterLink to="/" onClick={onClose}>
                      Observability Dashboard
                    </RouterLink>
                    <RouterLink to="/ct-scan" onClick={onClose}>
                      Brain ct scan
                    </RouterLink>
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
