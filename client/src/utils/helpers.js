/**
 * Format a price in Indian Rupees
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calculate discount percentage
 */
export const discountPercent = (original, discounted) => {
  return Math.round(((original - discounted) / original) * 100);
};

/**
 * Truncate text to given length
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

/**
 * Generate star rating array
 */
export const getStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => i < rating ? 'full' : 'empty');
};

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};
