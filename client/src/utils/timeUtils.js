/**
 * Returns a string representation of a number, with a zero if the number is lower than 10.
 * @ignore
 */
export const pad = (integer) => {
    return integer < 10 ? `0${integer}` : integer;
  };
  
  /**
   * Returns a 'hh:mm' string from a time in ms.
   * @param {Number} timeInMs Time in milliseconds.
   * @ignore
   */
  export const getHoursAndMinutes = (timeInMs) => {
    if (!timeInMs || timeInMs <= 0) {
      return "";
    }
    const date = new Date(timeInMs);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  export const convertTo12HourTime = (timeInMs) => {
      const date = new Date(timeInMs); // Convert the time to a Date object
      const hours = date.getHours(); // Get hours in 24-hour format
      const minutes = date.getMinutes(); // Get minutes
      const period = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
      const hours12 = hours % 12 || 12; // Convert to 12-hour format (0 becomes 12)
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
  
  /**
   * Returns a string representing a delay.
   * @param {Number} timeInMs Delay time in milliseconds.
   * @ignore
   */
  export const getDelayString = (delayInMs) => {
    let timeInMs = delayInMs;
    if (timeInMs < 0) {
      timeInMs = 0;
    }
    const h = Math.floor(timeInMs / 3600000);
    const m = Math.floor((timeInMs % 3600000) / 60000);
    const s = Math.floor(((timeInMs % 3600000) % 60000) / 1000);
  
    if (s === 0 && h === 0 && m === 0) {
      return "+0";
    }
    if (s === 0 && h === 0) {
      return `+${m}m`;
    }
    if (s === 0) {
      return `+${h}h${m}m`;
    }
    if (m === 0 && h === 0) {
      return `+${s}s`;
    }
    if (h === 0) {
      return `+${m}m${s}s`;
    }
    return `+${h}h${m}m${s}s`;
  };
  