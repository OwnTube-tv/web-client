export const capitalize = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const getAvailableVidsString = (count?: number) => {
  return ` (${count ?? "?"})`;
};
