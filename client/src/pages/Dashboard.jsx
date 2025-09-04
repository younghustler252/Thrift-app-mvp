// /pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import Loader from '@/components/common/Loader';
import AdminDashboard from './dashboard/AdminDashboard';
import UserDashboard from './dashboard/USerDashboard';
import { routes } from '@/routes/route';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            navigate(routes.login); // ✅ Correct usage
        }
    }, [user, loading, navigate]);

    if (loading) return <Loader />;

    if (!user) return null; // Or a fallback like <Loader /> or nothing while redirecting

    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    return <UserDashboard />;
};

export default Dashboard;
