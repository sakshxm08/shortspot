import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { URLProvider } from "./context/URLsContext.jsx";

createRoot(document.getElementById("root")).render(
  <URLProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </URLProvider>
);
