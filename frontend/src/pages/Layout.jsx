import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useLogout } from "../hooks/useLogout";

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logout } = useLogout();
  return (
    <div>
      <nav className="bg-primary-500 p-4 sticky top-0 left-0 right-0 z-50">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:underline">
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/my-urls" className="text-white hover:underline">
                  My URLs
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
