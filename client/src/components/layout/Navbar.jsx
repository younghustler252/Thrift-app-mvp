import { Link, useLocation } from "react-router-dom";
import IconRenderer from "../../assets/icons/IconRenderer";
import '../../css/Navbar.css'

function Navbar() {
    const location = useLocation();

    const Navitem = [
        { path: "/dashboard", icon: "FaHome", label: "Home" },
        { path: "/groups", icon: "FaUsers", label: "Group" },
        { path: "/history", icon: "FaHistory", label: "History" },
        { path: "/profile", icon: "FaUser", label: "me" },
    ];

    return (
        <nav className="bottom-nav">
            {Navitem.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-links ${isActive ? "active" : ""}`}
                    >
                        <IconRenderer name={item.icon} size={20} color={isActive ? "black" : "white"} />
                        <span className="nav-label">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default Navbar;
