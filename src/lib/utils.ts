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

export const createTimeRange = (initial: string, final: string) => {
  const timeArray = [];
  const currentTime = new Date(`1970-01-01T${initial}`);
  const endTime = new Date(`1970-01-01T${final}`);
  let id = 1;

  // Loop until currentTime exceeds endTime
  while (currentTime <= endTime) {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    timeArray.push({
      id: id.toString(),
      label: `${formattedHours}:${formattedMinutes} ${period}`,
      value: currentTime.toTimeString().split(' ')[0]
    });

    currentTime.setMinutes(currentTime.getMinutes() + 75); // Increment by 1 hour and 15 minutes
    id++;
  }

  return timeArray;
};
