import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      setUsername("");
      setPassword("");
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 transition-all text-white font-semibold rounded-lg"
        >
          Login
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </motion.div>
  );
};

export default Login;
