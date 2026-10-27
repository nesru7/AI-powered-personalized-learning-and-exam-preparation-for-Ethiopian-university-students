/**
 * lib/utils.ts
 *
 * Shared utility functions used across the application.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Tailwind class merging (shadcn/ui pattern) ───────────────────────────────

/**
 * Merges Tailwind CSS class names, resolving conflicts via tailwind-merge
 * and accepting conditional classes via clsx.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Date formatting ──────────────────────────────────────────────────────────

/**
 * Formats a Date using the Ethiopian English locale.
 * Example output: "January 1, 2024"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-ET', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// ─── Grade helpers ────────────────────────────────────────────────────────────

/**
 * Converts a numeric score (0–100) to a letter grade using the
 * Ethiopian university grading scale.
 */
export function calculateGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  if (score >= 45) return 'D';
  return 'F';
}

/**
 * Returns a Tailwind CSS text-color class based on a numeric score.
 * Used to colour score badges and chart labels.
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 65) return 'text-accent-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
}
