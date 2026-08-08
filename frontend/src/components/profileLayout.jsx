import { Outlet } from "react-router-dom";
import ProfileSidebar from "../pages/users/profileSidebar";
import Navbar from "./nav";

const ProfileLayout = () => {
  return (
    <>
      {/* <Navbar /> */}
      <ProfileSidebar />
      <Outlet />
    </>
  );
};

export default ProfileLayout;
