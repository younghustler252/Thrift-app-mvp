// AppRoute.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
    Dashboard,
    Group,
    History,
    Notification,
    CreateGroup,
    GroupDetails,
} from '@/pages/index';
import { Welcome, Signup, Login, ForgotPassword } from '@/pages/index';

import { AuthLayout } from '@/components/layout/AuthLayout';
import MainLayout from '@/components/layout/MainLayout';

import PrivateRoute from './PrivateRoutes';
import PublicRoute from './publicRoutes';
import { routes } from '@/routes/route';

function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.home} element={<Welcome />} />
                <Route element={<PublicRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route path={routes.login} element={<Login />} />
                        <Route path={routes.signup} element={<Signup />} />
                        <Route
                            path={routes.forgotPassword}
                            element={<ForgotPassword />}
                        />
                    </Route>
                </Route>

                {/* Protected Routes wrapped with BottomNav */}
                <Route element={<PrivateRoute />}>
                    <Route element={<MainLayout />}>
                        <Route
                            path={routes.dashboard}
                            element={<Dashboard />}
                        />
                        <Route path={routes.groups} element={<Group />} />
                        <Route path={routes.history} element={<History />} />
                        <Route
                            path={routes.payment}
                            element={<div>Coming soon</div>}
                        />
                        <Route
                            path={routes.profile}
                            element={<div>Coming soon</div>}
                        />
                        {/* ///other routes pages */}
                        <Route
                            path={routes.notification}
                            element={<Notification />}
                        />
                        <Route
                            path={routes.createGroup}
                            element={<CreateGroup />}
                        />
                        <Route
                            path={routes.groupDetails}
                            element={<GroupDetails />}
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoute;
