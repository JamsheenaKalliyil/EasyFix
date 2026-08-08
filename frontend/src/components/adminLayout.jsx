import { Outlet } from "react-router-dom"
import AdminNavbar from "../pages/admin/adminNavbar"

 
 const AdminLayout=()=>{

return(
    <>
    <AdminNavbar/>
    <Outlet/>
    
    </>
)

 }

 export default AdminLayout