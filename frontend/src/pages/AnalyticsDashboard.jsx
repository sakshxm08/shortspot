import { Outlet } from "react-router-dom";
import URLSidebar from "../components/URLSidebar";

const AnalyticsDashboard = () => {
  return (
    <div className="flex">
      <div className="w-1/4">
        <URLSidebar />
      </div>
      <div className="w-3/4">
        <Outlet />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
