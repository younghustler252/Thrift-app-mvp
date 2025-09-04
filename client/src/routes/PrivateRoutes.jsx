import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import useAuth from '@/hooks/useAuth';
import { routes } from './route';
import Loader from '@/components/common/Loader';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loader fullScreen={true} />;
    return user ? <Outlet /> : <Navigate to={routes.login} />;
};

export default PrivateRoute;
