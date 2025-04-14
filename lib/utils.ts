import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a human-readable string
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}

/**
 * Gets the current date formatted as a string
 * @returns Current date string
 */
export function getCurrentDate(): string {
  return formatDate(new Date())
}
