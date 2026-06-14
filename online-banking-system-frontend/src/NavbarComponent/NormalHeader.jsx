import { Link } from "react-router-dom";

const NormalHeader = () => {
  return (
    <>
      <ul className="navbar-nav ms-auto me-4 normal-nav">
        <li className="nav-item">
          <Link
            to="/user/admin/register"
            className="nav-link normal-link register-link"
          >
            Register Admin
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/user/login" className="nav-link normal-link">
            Login
          </Link>
        </li>
      </ul>

      {/* UI Styling */}
      <style>
        {`
          .normal-nav {
            gap: 8px;
            align-items: center;
          }

          .normal-link {
            color: #E5E7EB !important;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 8px;
            position: relative;
            transition: all 0.3s ease;
          }

          .normal-link::after {
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

          .normal-link:hover::after {
            width: 70%;
          }

          .normal-link:hover {
            background: rgba(255, 215, 0, 0.15);
            color: #ffffff !important;
          }

          .register-link {
            color: #FFD700 !important;
            font-weight: 700;
          }

          .register-link:hover {
            background: linear-gradient(135deg, rgba(106, 13, 173, 0.2), rgba(255, 215, 0, 0.2));
            color: #ffffff !important;
          }
        `}
      </style>
    </>
  );
};

export default NormalHeader;
