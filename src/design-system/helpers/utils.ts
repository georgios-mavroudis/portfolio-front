type TokenDefinition = Record<string, { value: string | number }>;

export const tokenToChakra = (token: Record<string, string | number>): TokenDefinition => {
  return Object.keys(token).reduce<TokenDefinition>((acc, key) => {
    return {
      ...acc,
      [key]: { value: token[key] },
    };
  }, {});
};
