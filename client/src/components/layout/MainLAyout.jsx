// components/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import { Navbar } from ".";

export default function MainLayout() {
    return (
        <div className="main-layout">
            <div className="content">
                <Outlet />
            </div>
            <Navbar />
        </div>
    );
}
