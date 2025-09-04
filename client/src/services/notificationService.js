import API from '@/Api/axios';

export const getNotification = async () => {
    try {
        const res = await API.get('/notification/', getNotification);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Failed to fetch group',
        );
    }
};

export const markAsRead = async (notificationId) => {
    try {
        const res = await API.post(`/notification/${notificationId}/read/`);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Failed to mark notification as read',
        );
    }
};
