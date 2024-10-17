export const hasMoreThanNSlashes = (str: string, n: number): boolean => {
  // Count the number of slashes in the string
  const slashCount = (str.match(/\//g) || []).length;
  return slashCount > n;
};

export const removeLeadingZeros = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  if (
    input.value.startsWith("0") &&
    input.value.length > 1 &&
    input.value[1] !== "."
  ) {
    input.value = input.value.replace(/^0+/, ""); // Remove leading zeros visually
  }
};
