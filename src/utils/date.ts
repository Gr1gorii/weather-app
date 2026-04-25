export const formatTime = (dateString: string | Date, timeZone?: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timeZone || undefined
  }).format(date);
};

export const formatHour = (dateString: string | Date, timeZone?: string): string => {
  const date = new Date(dateString);
  // If it is the current hour (could be simplified by comparing differences)
  // For simplicity, if difference is less than an hour, output 'Now' outside
  // But basically just return the hour
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: timeZone || undefined
  }).format(date);
};

export const formatDayOfWeek = (dateString: string | Date, timeZone?: string): string => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: timeZone || undefined
  });
  
  const day = formatter.format(date);
  // Capitalize: Mon, Tue, Wed...
  return day.charAt(0).toUpperCase() + day.slice(1);
};

export const formatFullDate = (dateString: string | Date, timeZone?: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    timeZone: timeZone || undefined
  }).format(date);
};

export const isToday = (dateString: string | Date): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

export const getRelativeDayName = (dateString: string | Date, timeZone?: string): string => {
  if (isToday(dateString)) return 'Today';
  return formatDayOfWeek(dateString, timeZone);
};
