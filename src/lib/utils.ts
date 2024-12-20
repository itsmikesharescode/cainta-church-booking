import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const format24hrTo12hrAMPM = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const isPM = hours >= 12;
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  const period = isPM ? 'PM' : 'AM';
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};
