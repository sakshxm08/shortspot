import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useLogout } from "../hooks/useLogout";

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logout } = useLogout();
  return (
    <div>
      <nav className="bg-blue-500 p-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:underline">
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/dashboard" className="text-white hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="text-white hover:underline"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:underline">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};
export default Layout;
