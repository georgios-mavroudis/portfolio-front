import { Link as ChakraLink, type LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import { Link as TanLink, type LinkProps as TanLinkProps } from '@tanstack/react-router';

type ChakraTanLinkProps = Omit<ChakraLinkProps, 'as' | 'href'> & TanLinkProps;
export type Route = Pick<TanLinkProps, 'to'>['to'];

export function RouterLink(props: ChakraTanLinkProps) {
  return <ChakraLink as={TanLink} {...props} />;
}
