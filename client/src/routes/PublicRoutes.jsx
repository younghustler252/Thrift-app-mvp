import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react'; // ✅ Import useContext
import useAuth from '@/hooks/useAuth';
import { routes } from '@/routes/route';
import Loader from '@/components/common/Loader';

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loader fullScreen={true} />;
    return user ? <Navigate to={routes.dashboard} /> : <Outlet />;
};

export default PublicRoute;
