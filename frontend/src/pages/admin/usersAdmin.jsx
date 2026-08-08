import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import { viewUsers } from "../../redux/authSlice";
import "./usersAdmin.css";

const UsersAdmin = () => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.auth.users);

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/view-all-users`,
         {withCredentials: true},
      );

      dispatch(viewUsers(response.data.users));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleBlock = async (id) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin/block-user/${id}`,
        {},
        // { withCredentials: true }
      );

      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users-page">
      <h2>Users</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users?.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user._id}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className={user.isBlocked ? "unblock-btn" : "block-btn"}
                  onClick={() => handleBlock(user._id)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersAdmin;
