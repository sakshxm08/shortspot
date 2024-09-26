import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import URLShortener from "./pages/URLShortener";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useUser } from "./hooks/useUser";
import { URLProvider } from "./context/URLsContext";
import MyURLs from "./pages/MyURLs";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import URLAnalytics from "./components/URLAnalytics";

const App = () => {
  const { user, loading } = useUser();

  if (loading) {
    return null; // Or a more sophisticated loading component
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: user ? <URLShortener /> : <Navigate to="/login" replace />,
        },
        {
          path: "/login",
          element: user ? <Navigate to="/" /> : <Login />,
        },
        {
          path: "/register",
          element: user ? <Navigate to="/" /> : <Register />,
        },
        {
          path: "/my-urls",
          element: user ? <MyURLs /> : <Navigate to="/login" />,
        },
        {
          path: "/analytics",
          element: user ? <AnalyticsDashboard /> : <Navigate to="/login" />,
          children: [
            {
              path: "",
              element: <div></div>,
            },
            {
              path: ":_id",
              element: <URLAnalytics />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <URLProvider>
      <RouterProvider router={router} />
    </URLProvider>
  );
};

export default App;
