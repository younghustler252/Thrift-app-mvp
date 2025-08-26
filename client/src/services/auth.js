import API from '../Api/axios'

export const registerUser = async (userData) => {
    try {
        const res = await API.post('/auth/register', userData);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data || "Something went wrong" 
        );
    }
}

export const loginUser = async (userData) => {
    try {
        const res = await API.post('/auth/login', userData);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data ||  "Something went wrong" 
        ); 
    }
}