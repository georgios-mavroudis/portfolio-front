import { Alert as ChakraAlert } from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
  status?: 'error' | 'success' | 'warning' | 'info' | 'neutral' | undefined; //"error" | "success" | "warning" | "info" | "loading";
};
export const Alert: React.FC<Props> = ({ title, description, status = 'success' }) => {
  return (
    <ChakraAlert.Root status={status} margin="s" w="auto">
      <ChakraAlert.Indicator />
      <ChakraAlert.Content>
        <ChakraAlert.Title>{title}</ChakraAlert.Title>
        {description && <ChakraAlert.Description>{description}</ChakraAlert.Description>}
      </ChakraAlert.Content>
    </ChakraAlert.Root>
  );
};
