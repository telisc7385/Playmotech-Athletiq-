import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/upload", label: "Upload" },
    { to: "/sessions", label: "History" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-ghost-700">
          Ghost Coach
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition ${
                location.pathname === link.to
                  ? "text-ghost-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-600">{user?.fullName}</span>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
