import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 * @param value The number to format
 * @param options Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string,
  options: {
    currency?: string;
    notation?: Intl.NumberFormatOptions['notation'];
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
  } = {}
): string {
  const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

  if (Number.isNaN(numValue)) {
    return '0';
  }

  const {
    currency = '',
    notation = 'standard',
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
  } = options;

  // Format the number
  const formatted = new Intl.NumberFormat('en-US', {
    notation,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(numValue);

  return formatted;
}
