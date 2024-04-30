/**
 * Eg:
 * originalDate = 1706637600000
 * hour = 14
 */
const convertToUnixDateTime = (originalDate, hour) => {
  if (!originalDate || originalDate === new Date()) {
    let current = new Date();
    originalDate = current.setHours(0, 0, 0, 0);
  }
  dateWithOriginalTime = new Date(originalDate);
  dateWithOriginalTime.setHours(hour, 0, 0, 0);
  const updatedTime = dateWithOriginalTime.getTime();
  return updatedTime;
};

const getTimezoneOffset = (timezone) => {
  const timezoneDate = new Date();
  const utcDate = timezoneDate.toUTCString();
  const timezoneOffset = new Date(utcDate).toLocaleString("en-US", {
    timeZone: timezone,
  });
  const timezoneOffsetDate = new Date(timezoneOffset);
  return (timezoneOffsetDate - timezoneDate) / (60 * 1000);
};

const getDateOfIndexDay = (dayIndex, hour, timezone) => {
  const currentDate = new Date();

  // Calculate the current day index (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  let currentDayIndex = currentDate.getDay();

  // Adjust the current day index to match the provided dayIndex
  currentDayIndex = currentDayIndex === 0 ? 7 : currentDayIndex; // If Sunday, set it to 7
  const daysUntilDay = (dayIndex - currentDayIndex + 7) % 7;

  // Calculate the date of the requested day
  const dayDate = new Date(currentDate);
  dayDate.setDate(currentDate.getDate() + daysUntilDay);

  // Get the timezone offset in minutes
  const timezoneOffset = getTimezoneOffset(timezone);

  // Adjust the hour according to the timezone offset
  dayDate.setHours(hour - timezoneOffset / 60, 0, 0, 0);

  return dayDate;
};

module.exports = {
  convertToUnixDateTime,
  getDateOfIndexDay,
};
