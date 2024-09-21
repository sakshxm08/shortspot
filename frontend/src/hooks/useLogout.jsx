import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";
import { setAuthToken } from "../api";

export const useLogout = () => {
  const { setUser, setToken } = useUser();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setAuthToken(null); // Add this line
    navigate("/");
  };

  return { logout };
};
