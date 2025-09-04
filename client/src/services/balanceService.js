import API from '@/Api/axios';

/**
 * 👤 Get user's balance in a specific group
 * @param {string} groupId
 */
export const getUserBalance = async (groupId) => {
    try {
        const res = await API.get(`/balance/group/${groupId}`);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Failed to fetch user group balance',
        );
    }
};

/**
 * 👤 Get user's balance across all groups
 */
export const getAllUserGroupBalances = async () => {
    try {
        const res = await API.get(`/balance/groups`);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Failed to fetch all group balances',
        );
    }
};

/**
 * 👤 Get user's total/global balance
 */
export const getGlobalBalance = async () => {
    try {
        const res = await API.get(`/balance/global`);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Failed to fetch global balance',
        );
    }
};

/**
 * 🛡️ Get all user balances in a group (admin)
 * @param {string} groupId
 */
export const getGroupUserBalances = async (groupId) => {
    try {
        const res = await API.get(`/balance/global`);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Failed to fetch group user balances',
        );
    }
};
