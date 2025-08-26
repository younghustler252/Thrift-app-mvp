// AppRoute.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, Group, History } from "@pages/index";
import { Welcome ,Signup, Login, ForgotPassword } from "@pages/index";

import { AuthLayout } from "@components/layout/AuthLayout";
import MainLayout from "@components/layout/MainLayout";  // Your layout with BottomNav
function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                    {/* Public Routes (No BottomNav) */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* Protected Routes wrapped with BottomNav */}
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/groups" element={<Group />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/payment" element={<div>Coming soon</div>} />
                    <Route path="/profile" element={<div>Coming soon</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoute;
