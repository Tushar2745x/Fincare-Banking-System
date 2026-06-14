import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminHeader = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-admin"));

  const adminLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-admin");
    sessionStorage.removeItem("admin-jwtToken");
    navigate("/home");
    window.location.reload(true);
  };

  return (
    <>
      <ul className="navbar-nav ms-auto me-4 admin-nav">
        <li className="nav-item">
          <Link to="/user/bank/register" className="nav-link admin-link">
            Register Bank Manager
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/bank/register" className="nav-link admin-link">
            Add Bank
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/bank/all" className="nav-link admin-link">
            View Banks
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/bank/managers" className="nav-link admin-link">
            Bank Managers
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/all/bank/customers" className="nav-link admin-link">
            All Customers
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/bank/account/all" className="nav-link admin-link">
            Bank Accounts
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/admin/bank/customer/transaction/all"
            className="nav-link admin-link"
          >
            Transactions
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to=""
            className="nav-link admin-link logout-link"
            onClick={adminLogout}
          >
            Logout
          </Link>
          <ToastContainer />
        </li>
      </ul>

      {/* UI Styling */}
      <style>
        {`
          .admin-nav {
            gap: 6px;
            align-items: center;
          }

          .admin-link {
            color: #E5E7EB !important;
            font-weight: 600;
            padding: 8px 14px;
            border-radius: 8px;
            position: relative;
            transition: all 0.3s ease;
          }

          .admin-link::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 4px;
            width: 0;
            height: 2px;
            background: #FFD700;
            transition: 0.3s;
            transform: translateX(-50%);
          }

          .admin-link:hover::after {
            width: 70%;
          }

          .admin-link:hover {
            color: #ffffff !important;
            background: rgba(255, 215, 0, 0.15);
          }

          .logout-link {
            color: #F87171 !important;
            font-weight: 700;
          }

          .logout-link:hover {
            background: rgba(248, 113, 113, 0.15);
            color: #FCA5A5 !important;
          }
        `}
      </style>
    </>
  );
};

export default AdminHeader;
