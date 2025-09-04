import API from '../Api/axios';
import { handleError } from '@/utils/errorHandler';

export const getGroups = async () => {
    try {
        const res = await API.get('/groups/');
        return res.data;
    } catch (error) {
        handleError(error, 'Failed to fetch groups');
    }
};
export const getAllGroups = async () => {
    try {
        const res = await API.get('/groups/all');
        return res.data;
    } catch (error) {
        handleError(error, 'Failed to fetch groups');
    }
};

// Get specific group by ID
export const getGroupById = async (groupId) => {
    try {
        const res = await API.get(`/groups/${groupId}`);
        return res.data;
    } catch (error) {
        handleError(error, 'Failed to fetch group');
    }
};

// Join group
export const joinGroup = async (groupId) => {
    try {
        const res = await API.post(`/groups/${groupId}/join`);
        return res.data;
    } catch (error) {
        handleError(error, 'Failed to join group');
    }
};

// Create group
export const createGroup = async (groupData) => {
    try {
        const res = await API.post('/groups', groupData);
        return res.data;
    } catch (error) {
        handleError(error, 'Failed to create group');
    }
};

//update group

export const updateGroup = async (groupId, groupData) => {
    try {
        const res = await API.put(`/groups/${groupId}`, groupData);
        return res.data;
    } catch (error) {
        handleError(error, 'Failed to update group');
    }
};
