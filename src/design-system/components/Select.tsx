import {
  Select as ChakraSelect,
  createListCollection,
  Portal,
  Text,
  type CollectionOptions,
  type SelectValueChangeDetails,
} from '@chakra-ui/react';

export type SelectOption<T> = { label: string; value: T };

interface Props<T extends string | number> {
  options: CollectionOptions<SelectOption<T>>;
  onChange: (value: SelectValueChangeDetails<SelectOption<T>>) => void;
  value: T;
  placeholder?: string;
  title: string;
}
export const Select = <T extends string | number>({
  options,
  onChange,
  value,
  placeholder,
  title,
}: Props<T>) => {
  const list = createListCollection<SelectOption<T>>(options);
  return (
    <ChakraSelect.Root collection={list} size="sm" width="320px" onValueChange={onChange}>
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Label>{title}</ChakraSelect.Label>
      <ChakraSelect.Control>
        <ChakraSelect.Trigger>
          <Text color="text.primary">{value}</Text>
          {!value && <ChakraSelect.ValueText placeholder={placeholder} />}
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          <ChakraSelect.Indicator />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content>
            {list.items.map((option) => (
              <ChakraSelect.Item item={option} key={option.value}>
                {option.label}
                <ChakraSelect.ItemIndicator />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  );
};
