import { Outlet } from "react-router-dom";
import { logo } from "../../assets";
import '@css/AuthLayout.css'
export function AuthLayout() {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                <div className="auth-logo">
                    <img src={logo} alt="" />
                </div>
                <Outlet />
                
                    
            </div>
        </div>
    );
}


