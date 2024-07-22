/**
  Pluralizes the supplied word based on the provided dataset.
  @param string The item name to be pluralized
  @param value The integer to be checked (optional)
  @returns The item pluralized if required
*/
export const pluralize = (string: string, value?: number) => {
  const special = {
    entity: "entities",
  };
  if (value === 1) {
    return string;
  } else if (string in special) {
    return special[string as keyof typeof special];
  }
  return `${string}s`;
};
