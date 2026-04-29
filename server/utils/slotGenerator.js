/**
 * Generate available time slots for a given date and stylist.
 * Slots run from 10:00 AM to 7:00 PM in 30-min increments.
 * Already-booked slots are excluded.
 */

const ALL_SLOTS = [
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM',
  '07:00 PM',
];

/**
 * @param {string[]} bookedSlots - Array of already-booked slot strings
 * @returns {string[]} - Available slot strings
 */
const generateAvailableSlots = (bookedSlots = []) => {
  return ALL_SLOTS.filter((slot) => !bookedSlots.includes(slot));
};

/**
 * Get day-of-week string for a given date (matches Stylist.availability keys).
 * @param {Date|string} date
 * @returns {string} e.g. 'monday'
 */
const getDayOfWeek = (date) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date(date).getDay()];
};

module.exports = { generateAvailableSlots, getDayOfWeek, ALL_SLOTS };
