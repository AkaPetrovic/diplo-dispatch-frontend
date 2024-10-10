export const isValidDate = (dateStr: string): boolean => {
  // Ensure the format is correct (DD/MM/YYYY)
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return false; // Check for correct structure without a trailing slash
  }

  const dateParts = dateStr.split("/");

  const [dayStr, monthStr, yearStr] = dateParts;

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  // Ensure day, month, and year are valid numbers
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

  // Ensure month is valid (1-12)
  if (month < 1 || month > 12) return false;

  // Days in each month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check for leap year and adjust February days
  if (month === 2 && isLeapYear(year)) {
    daysInMonth[1] = 29;
  }

  // Ensure day is valid for the given month
  if (day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }

  // If all checks passed, the date is valid
  return true;
};

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
