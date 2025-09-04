// utils/errorHandler.js
export const handleError = (error, defaultMessage) => {
    throw new Error(
        error?.response?.data?.message || error?.message || defaultMessage,
    );
};
