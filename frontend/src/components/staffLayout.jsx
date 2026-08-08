import { Outlet } from "react-router-dom";
import StaffSidebar from "../pages/staff/staffSidebar";

const StaffLayout = () => {
  return (
    <div>
      <StaffSidebar />
      <Outlet />
    </div>
  );
};

export default StaffLayout;
