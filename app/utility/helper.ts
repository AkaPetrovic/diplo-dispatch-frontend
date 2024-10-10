export const hasMoreThanNSlashes = (str: string, n: number): boolean => {
  // Count the number of slashes in the string
  const slashCount = (str.match(/\//g) || []).length;
  return slashCount > n;
};
