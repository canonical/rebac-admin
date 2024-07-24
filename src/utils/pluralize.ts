/**
  Pluralizes the supplied word based on the provided dataset.
  @returns The item pluralized if required
*/
export const pluralize = (string: string, count?: number) => {
  const special = {
    entity: "entities",
  };
  if (count === 1) {
    return string;
  } else if (string in special) {
    return special[string as keyof typeof special];
  }
  return `${string}s`;
};
