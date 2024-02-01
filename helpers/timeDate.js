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

module.exports = {
  convertToUnixDateTime,
};
