import { Outlet } from "react-router-dom";

import Footer from "./footer";
import Navbar from "./nav";

const UserLayout = () => {
  return (
    <div>
      <Navbar/>
      <Outlet />
      <Footer />
    </div>
  );
};

export default UserLayout;
