type TokenDefinition = Record<string, { value: string }>;

export const colorToChakra = (paletteColor: Record<string, string>): TokenDefinition => {
  return Object.keys(paletteColor).reduce<TokenDefinition>((acc, key) => {
    return {
      ...acc,
      [key]: { value: paletteColor[key] },
    };
  }, {});
};
