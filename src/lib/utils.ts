import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isNew = (created_at: string | undefined) => {
  if (!created_at) return false;

  const createdDate = new Date(created_at);
  const currentDate = new Date();

  const differenceInDays = (currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

  return differenceInDays < 3;
};
