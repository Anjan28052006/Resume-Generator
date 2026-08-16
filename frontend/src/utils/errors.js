export const getErrorMessage = (error, defaultMessage = 'An unexpected error occurred.') => {
  if (!error) return defaultMessage;

  if (typeof error === 'string') return error;

  // Backend standard error format { success: false, message: "..." }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios network error
  if (error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the ResumeForge server. Please ensure the backend is running.';
  }

  if (error.response?.status === 401) {
    return 'Your session has expired. Please log in again.';
  }

  if (error.response?.status === 403) {
    return 'You are not authorized to perform this action.';
  }

  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }

  if (error.response?.status === 500) {
    return error.response.data?.message || 'Internal server error during operation.';
  }

  return error.message || defaultMessage;
};
