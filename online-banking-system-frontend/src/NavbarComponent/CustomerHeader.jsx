import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const CustomerHeader = () => {
  let navigate = useNavigate();

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  const userLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-customer");
    sessionStorage.removeItem("customer-jwtToken");

    navigate("/home");
    window.location.reload(true);
  };

  const handleTransactionHistoryClick = () => {
    navigate("/customer/bank/account/statement", { state: customer });
  };

  const viewBankAccount = () => {
    if (customer.isAccountLinked === "Yes") {
      navigate("/customer/bank/account/detail", { state: customer });
    } else {
      toast.error("Bank Account Not Linked, Contact Bank Administrator!!!!", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  const moneyTransfer = () => {
    if (customer.isAccountLinked === "Yes") {
      navigate("/customer/account/transfer");
    } else {
      toast.error("Bank Account Not Linked, Contact Bank Administrator!!!!", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <ul className="navbar-nav ms-auto me-4 customer-nav">
        <li className="nav-item">
          <span className="nav-link customer-link" onClick={moneyTransfer}>
            Money Transfer
          </span>
          <ToastContainer />
        </li>

        <li className="nav-item">
          <span className="nav-link customer-link" onClick={viewBankAccount}>
            Bank Account
          </span>
          <ToastContainer />
        </li>

        <li className="nav-item">
          <span
            className="nav-link customer-link"
            onClick={handleTransactionHistoryClick}
          >
            Transaction History
          </span>
        </li>

        <li className="nav-item">
          <span
            className="nav-link customer-link"
            onClick={() => {
              if (customer?.isAccountLinked === "Yes") {
                navigate("/customer/bank/account/detail#spending-chart", {
                  state: customer,
                });
              } else {
                toast.error(
                  "Bank Account Not Linked, Contact Bank Administrator!!!!",
                  { position: "top-center", autoClose: 1000 }
                );
              }
            }}
          >
            Spending Chart
          </span>
        </li>

        <li className="nav-item">
          <Link to="/customer/card/details" className="nav-link customer-link">
            Card Details
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to=""
            className="nav-link customer-link logout-link"
            onClick={userLogout}
          >
            Logout
          </Link>
          <ToastContainer />
        </li>
      </ul>

      {/* UI / UX Styling */}
      <style>
        {`
          .customer-nav {
            gap: 8px;
            align-items: center;
          }

          .customer-link {
            color: #E5E7EB;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
          }

          .customer-link::after {
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

          .customer-link:hover::after {
            width: 70%;
          }

          .customer-link:hover {
            background: rgba(255, 215, 0, 0.15);
            color: #ffffff;
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

export default CustomerHeader;
