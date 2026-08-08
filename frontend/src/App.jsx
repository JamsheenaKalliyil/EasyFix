import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/userLayout";
import Home from "./components/home";

import Signup from "./pages/users/signup";
import Signin from "./pages/users/signin";
import VerifyEmail from "./pages/users/verifyEmail";
import VerifyOtp from "./pages/users/verifyOtp";

import ResetPassword from "./pages/users/resetPassword";
import AdminHome from "./pages/admin/adminHome";
import AdminNavbar from "./pages/admin/adminNavbar";
import AdminLayout from "./components/adminLayout";
import ServicesAdmin from "./pages/admin/servicesAdmin";
import AddServices from "./pages/admin/addServices";
import AddStaff from "./pages/admin/addStaff";
import StaffAdmin from "./pages/admin/staffAdmin";
import UsersAdmin from "./pages/admin/usersAdmin";
import Services from "./pages/users/services";
import OrderNow from "./pages/users/orderNow";
import UserProfile from "./pages/users/userProfile";
import UserOrders from "./pages/users/userOrders";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "./utils/urls";
import { signIn, signOut } from "./redux/authSlice";
import OrderAdmin from "./pages/admin/orderAdmin";
import OrderDetailsAdmin from "./pages/admin/orderDetailsAdmin";
import AssignWorks from "./pages/admin/assignWorks";
import WorksAdmin from "./pages/admin/worksAdmin";
import StaffLayout from "./components/staffLayout";
import StaffDashboard from "./pages/staff/staffDashboard";
import AssignedWorks from "./pages/staff/assignedWorks";
import OrderDetailsStaff from "./pages/staff/orderDetailsStaff";
import GenerateBill from "./pages/staff/generateBill";
import PayNow from "./pages/users/payNow";
import ServiceDetails from "./pages/users/serviceDetails";
import UserProtectedRoutes from "./components/userProtectedRoutes";
import AdminProtectedRoutes from "./components/adminProtectedRoutes";
import StaffProtectedRoutes from "./components/staffProtectedRoutes";
import EditService from "./pages/admin/editService";
import EditStaff from "./pages/admin/editStaff";
import StaffDetails from "./pages/admin/staffDetails";
import Wallet from "./pages/admin/wallet";
import SalaryManagement from "./pages/admin/salaryManagement";
import About from "./pages/users/about";
import UserOrderDetails from "./pages/users/userOrderDetails";
import ProfileLayout from "./components/profileLayout";
import UserAddress from "./pages/users/userAddress";
import AddAddress from "./pages/users/addAddress";
import MyFavorites from "./pages/users/myFavorites";
import MyReviews from "./pages/users/myReviews";
import StaffProfile from "./pages/staff/staffProfile";
import StaffReviews from "./pages/staff/staffReviews";
import LocationManagement from "./pages/admin/locationManagement";
import TermsConditions from "./pages/users/T&C";
import PageNotFound from "./pages/users/pageNotFound";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile`, {
          withCredentials: true,
        });

        dispatch(signIn({ user: response.data.user }));
      } catch (error) {
        console.log(error);
        dispatch(signOut());
      }
    };

    checkUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/about" element={<About />} />
          <Route path="/T&C" element={<TermsConditions />} />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service-details/:id" element={<ServiceDetails />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route element={<UserProtectedRoutes />}>
          <Route element={<ProfileLayout/>}>
            <Route path="/order-now/:id" element={<OrderNow />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-orders" element={<UserOrders />} />
            <Route path="/pay-now/:id" element={<PayNow />} />
            <Route path="/user-address" element={<UserAddress />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/my-favorites" element={<MyFavorites />} />
            <Route path="/my-reviews" element={<MyReviews />} />

            <Route
              path="/user-order-details/:id"
              element={<UserOrderDetails />}
            />
          </Route>
        </Route>
        <Route element={<AdminProtectedRoutes />}>
          <Route element={<AdminLayout/>}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin-navbar" element={<AdminNavbar />} />
            <Route path="admin/services" element={<ServicesAdmin />} />
            <Route path="admin/add-services" element={<AddServices />} />
            <Route path="admin/edit-service/:id" element={<EditService />} />
            <Route path="admin/add-staff" element={<AddStaff />} />
            <Route path="admin/staff" element={<StaffAdmin />} />
            <Route path="admin/edit-staff/:id" element={<EditStaff />} />
            <Route path="admin/staff-details/:id" element={<StaffDetails />} />
            <Route path="admin/users" element={<UsersAdmin />} />
            <Route path="admin/orders" element={<OrderAdmin />} />
            <Route path="admin/wallet" element={<Wallet />} />
            <Route
              path="/admin/order-details/:id"
              element={<OrderDetailsAdmin />}
            />
            <Route path="admin/assign-staff/:id" element={<AssignWorks />} />
            <Route path="admin/works-admin" element={<WorksAdmin />} />
            <Route
              path="admin/salary-management"
              element={<SalaryManagement />}
            />
            <Route
              path="admin/location-management"
              element={<LocationManagement />}
            />
          </Route>
        </Route>
        <Route element={<StaffProtectedRoutes />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/my-works" element={<AssignedWorks />} />
            <Route
              path="/staff/order-details-staff/:id"
              element={<OrderDetailsStaff />}
            />
            <Route path="/staff/generate-bill/:id" element={<GenerateBill />} />
            <Route path="/staff/staff-profile" element={<StaffProfile />} />
            <Route path="/staff/staff-reviews" element={<StaffReviews />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
