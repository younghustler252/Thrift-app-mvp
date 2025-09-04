// src/components/Navbar.jsx

import { Link, useLocation } from 'react-router-dom';
import IconRenderer from '@/assets/icons/IconRenderer';
import '@/css/Navbar.css';

function Navbar() {
    const location = useLocation();

    const NavItems = [
        { path: '/dashboard', icon: 'Home', label: 'Home' },
        { path: '/groups', icon: 'Users', label: 'Groups' },
        { path: '/history', icon: 'History', label: 'History' },
        { path: '/profile', icon: 'User', label: 'Me' },
    ];

    return (
        <nav className="bottom-navbar">
            <ul className="navbar-menu">
                {NavItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <li key={item.path} className="navbar-item">
                            <Link
                                to={item.path}
                                className={`navbar-link ${isActive ? 'active' : ''}`}>
                                <IconRenderer
                                    name={item.icon}
                                    size={22}
                                    color={isActive ? '#00b386' : '#999'}
                                />
                                <span className="navbar-label">
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default Navbar;
