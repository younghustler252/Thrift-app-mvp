// components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import { Navbar } from '.';
import '@/css/MainLayout.css';

export default function MainLayout() {
    return (
        <div className="main-layout">
            <div className="main-content">
                <Outlet />
            </div>
            <Navbar />
        </div>
    );
}
