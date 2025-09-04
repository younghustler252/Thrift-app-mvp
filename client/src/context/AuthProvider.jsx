import { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext'; // 👈 the context itself
import { getProfile } from '@/services/userService';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await getProfile();
                setUser(data);
            } catch {
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    const token = localStorage.getItem('token');
    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
