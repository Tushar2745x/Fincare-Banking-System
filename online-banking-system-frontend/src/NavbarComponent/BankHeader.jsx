import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BankHeader = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-bank"));

  const bankLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-bank");
    sessionStorage.removeItem("bank-jwtToken");
    navigate("/home");
    window.location.reload(true);
  };

  return (
    <>
      <ul className="navbar-nav ms-auto me-4 bank-nav">
        <li className="nav-item">
          <Link to="/user/customer/register" className="nav-link bank-link">
            Register Customer
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/bank/account/all" className="nav-link bank-link">
            Bank Accounts
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/bank/customer/all" className="nav-link bank-link">
            Bank Customers
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/bank/customer/account/transactions"
            className="nav-link bank-link"
          >
            Customer Transactions
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/bank/loan/applications"
            className="nav-link bank-link"
          >
            Loan Approvals
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/bank/card/applications" className="nav-link bank-link">
            Card Approvals
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/home"
            className="nav-link bank-link logout-link"
            onClick={bankLogout}
          >
            Logout
          </Link>
          <ToastContainer />
        </li>
      </ul>

      {/* UI / UX Styling */}
      <style>
        {`
          .bank-nav {
            gap: 8px;
            align-items: center;
          }

          .bank-link {
            color: #E5E7EB !important;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 8px;
            position: relative;
            transition: all 0.3s ease;
          }

          .bank-link::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 4px;
            width: 0;
            height: 2px;
            background: #FFD700;
            transition: 0.3s ease;
            transform: translateX(-50%);
          }

          .bank-link:hover::after {
            width: 70%;
          }

          .bank-link:hover {
            background: rgba(255, 215, 0, 0.15);
            color: #ffffff !important;
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

export default BankHeader;
