export const dateToString = (date: Date) => Intl.DateTimeFormat('en-UK', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',

  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  
  timeZone: 'UTC'
}).format(date);