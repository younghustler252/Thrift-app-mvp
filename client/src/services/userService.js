import API from '../Api/axios';

export const getProfile = async () => {
    try {
        const res = await API.get('/users/me');
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Failed to fetch profile',
        );
    }
};
