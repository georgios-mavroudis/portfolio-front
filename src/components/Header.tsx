import { Button } from '@chakra-ui/react';
import { RouterLink } from '@/design-system/components/RouterLink';
import { Drawer, HStack, Stack, useDisclosure, VStack } from '@chakra-ui/react';
import { Menu01 } from '@untitled-ui/icons-react';
import { type FC } from 'react';
import { ColorModeButton } from '@/design-system/components/color-mode';
import { Logo } from '@/design-system/custom-icons/Logo';

export const Header: FC = () => {
  const { open, onToggle, onClose } = useDisclosure();

  return (
    <Stack as="header" width="full" p={2} borderBottom="sm" boxShadow="lg">
      <HStack justifyContent="space-between">
        <Logo />
        <HStack>
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
                    <RouterLink to="/sleep-data" onClick={onClose}>
                      Sleep Data
                    </RouterLink>
                    <RouterLink to="/scaled-scatter-plot" onClick={onClose}>
                      Scaled Scatter Plot
                    </RouterLink>
                    <RouterLink to="/f-shape" onClick={onClose}>
                      WebGL testing
                    </RouterLink>
                    <RouterLink to="/" onClick={onClose}>
                      Financial Data
                    </RouterLink>
                    <RouterLink to="/" onClick={onClose}>
                      Observability Dashboard
                    </RouterLink>
                    <RouterLink to="/" onClick={onClose}>
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
