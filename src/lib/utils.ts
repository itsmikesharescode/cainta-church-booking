import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const format24hrTo12hrAMPM = (time: string) => {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const isPM = hours >= 12;
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const period = isPM ? 'PM' : 'AM';
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    return ''; // Return empty string on error
  }
};

export const createTimeRange = (initial: string, final: string) => {
  const timeArray = [];
  const currentTime = new Date(`1970-01-01T${initial}`);
  const endTime = new Date(`1970-01-01T${final}`);
  let id = 1;

  // Loop until currentTime reaches endTime
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

    currentTime.setMinutes(currentTime.getMinutes() + 15); // Changed to 15-minute intervals
    id++;
  }

  return timeArray.sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.value}`);
    const timeB = new Date(`1970-01-01T${b.value}`);
    return timeA.getTime() - timeB.getTime();
  });
};

export const createRefID = (length: number) => {
  const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }

  return result;
};
