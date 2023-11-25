export const dateToString = (date: Date) => Intl.DateTimeFormat('en-UK', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',

  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  
  timeZone: 'UTC'
}).format(date);

export const dateAsUTC = (date: Date) => new Date(Date.UTC(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
  date.getUTCHours() + 1, // Add one hour to get the correct time (UTC+1)
  date.getUTCMinutes()
));