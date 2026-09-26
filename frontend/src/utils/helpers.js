/**
 * Format ISO date string into a user-friendly format
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Format relative time (e.g. "5m ago", "2h ago", "yesterday")
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

/**
 * Truncate long text strings
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Extract clean error message from backend Axios response
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Session-level viewed comments state helpers
 * Tracks viewed comment IDs in sessionStorage without altering the database.
 */
export const getViewedCommentIds = (userId = 'default') => {
  try {
    const key = `ticketflow_viewed_comments_${userId || 'default'}`;
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markCommentsAsViewed = (userId = 'default', commentIds = []) => {
  if (!commentIds || !commentIds.length) return;
  try {
    const key = `ticketflow_viewed_comments_${userId || 'default'}`;
    const current = getViewedCommentIds(userId);
    const updated = Array.from(new Set([...current, ...commentIds]));
    sessionStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('ticketflow_comments_viewed', {
        detail: { userId: userId || 'default', viewedIds: updated },
      })
    );
  } catch {
    // Non-blocking storage fallback
  }
};

export const getUnviewedCommentsCount = (comments = [], userId = 'default') => {
  const viewedIds = getViewedCommentIds(userId);
  return comments.filter((c) => !viewedIds.includes(c._id)).length;
};
