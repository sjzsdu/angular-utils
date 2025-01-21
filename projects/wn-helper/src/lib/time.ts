// FILEPATH: /Users/juzhongsun/Codes/javascripts/angular-utils/projects/wn-helper/src/lib/date-utils.ts

import {
  format,
  parse,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isAfter,
  isBefore,
  isEqual,
  isValid,
  parseISO,
} from 'date-fns';

/**
 * Format a date to a string using the specified format
 * @param date The date to format
 * @param formatStr The format string (default: 'yyyy-MM-dd')
 * @returns Formatted date string
 */
export function formatDate(date: Date | number | undefined, formatStr: string = 'yyyy-MM-dd'): string {
  if (!date) {
    date = new Date();
  }
  return format(date, formatStr);
}

/**
 * Parse a date string to a Date object
 * @param dateStr The date string to parse
 * @param formatStr The format of the date string
 * @returns Parsed Date object
 */
export function parseDate(dateStr: string, formatStr: string): Date {
  return parse(dateStr, formatStr, new Date());
}

/**
 * Get today's date
 * @returns Today's date as a Date object
 */
export function getToday(): Date {
  return new Date();
}

/**
 * Get yesterday's date
 * @returns Yesterday's date as a Date object
 */
export function getYesterday(): Date {
  return subDays(new Date(), 1);
}

/**
 * Get tomorrow's date
 * @returns Tomorrow's date as a Date object
 */
export function getTomorrow(): Date {
  return addDays(new Date(), 1);
}

/**
 * Get the start of the current week
 * @returns Start of the week as a Date object
 */
export function getStartOfWeek(): Date {
  return startOfWeek(new Date());
}

/**
 * Get the end of the current week
 * @returns End of the week as a Date object
 */
export function getEndOfWeek(): Date {
  return endOfWeek(new Date());
}

/**
 * Get the start of the current month
 * @returns Start of the month as a Date object
 */
export function getStartOfMonth(): Date {
  return startOfMonth(new Date());
}

/**
 * Get the end of the current month
 * @returns End of the month as a Date object
 */
export function getEndOfMonth(): Date {
  return endOfMonth(new Date());
}

/**
 * Get the start of the current year
 * @returns Start of the year as a Date object
 */
export function getStartOfYear(): Date {
  return startOfYear(new Date());
}

/**
 * Get the end of the current year
 * @returns End of the year as a Date object
 */
export function getEndOfYear(): Date {
  return endOfYear(new Date());
}

/**
 * Calculate the difference in days between two dates
 * @param dateLeft The later date
 * @param dateRight The earlier date
 * @returns The number of days between the two dates
 */
export function getDaysDifference(dateLeft: Date | number, dateRight: Date | number): number {
  return differenceInDays(dateLeft, dateRight);
}

/**
 * Calculate the difference in months between two dates
 * @param dateLeft The later date
 * @param dateRight The earlier date
 * @returns The number of months between the two dates
 */
export function getMonthsDifference(dateLeft: Date | number, dateRight: Date | number): number {
  return differenceInMonths(dateLeft, dateRight);
}

/**
 * Calculate the difference in years between two dates
 * @param dateLeft The later date
 * @param dateRight The earlier date
 * @returns The number of years between the two dates
 */
export function getYearsDifference(dateLeft: Date | number, dateRight: Date | number): number {
  return differenceInYears(dateLeft, dateRight);
}

/**
 * Check if a date is after another date
 * @param date The date to check
 * @param dateToCompare The date to compare against
 * @returns True if the date is after dateToCompare, false otherwise
 */
export function isDateAfter(date: Date | number, dateToCompare: Date | number): boolean {
  return isAfter(date, dateToCompare);
}

/**
 * Check if a date is before another date
 * @param date The date to check
 * @param dateToCompare The date to compare against
 * @returns True if the date is before dateToCompare, false otherwise
 */
export function isDateBefore(date: Date | number, dateToCompare: Date | number): boolean {
  return isBefore(date, dateToCompare);
}

/**
 * Check if two dates are equal
 * @param dateLeft The first date to compare
 * @param dateRight The second date to compare
 * @returns True if the dates are equal, false otherwise
 */
export function areDatesEqual(dateLeft: Date | number, dateRight: Date | number): boolean {
  return isEqual(dateLeft, dateRight);
}

/**
 * Check if a date is valid
 * @param date The date to check
 * @returns True if the date is valid, false otherwise
 */
export function isValidDate(date: any): boolean {
  return isValid(date);
}

/**
 * Parse an ISO date string to a Date object
 * @param dateString The ISO date string to parse
 * @returns Parsed Date object
 */
export function parseISODate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Add days to a date
 * @param date The original date
 * @param amount The number of days to add
 * @returns A new Date with the days added
 */
export function addDaysToDate(date: Date | number, amount: number): Date {
  return addDays(date, amount);
}

/**
 * Subtract days from a date
 * @param date The original date
 * @param amount The number of days to subtract
 * @returns A new Date with the days subtracted
 */
export function subtractDaysFromDate(date: Date | number, amount: number): Date {
  return subDays(date, amount);
}
