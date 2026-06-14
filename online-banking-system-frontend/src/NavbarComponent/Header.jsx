import { Link } from "react-router-dom";
import logo from "../images/LOGO.png";
import RoleNav from "./RoleNav";

const Header = () => {
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));
  const isLoggedIn = customer || admin || bank;

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "linear-gradient(135deg, #0D0F2A, #1A1F44)",
        padding: "12px 25px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
      }}
    >
      <div className="container-fluid">
        {/* Logo + Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <div
            style={{
              background: "white",
              padding: "6px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(68, 0, 255, 0.8)",
              marginRight: "10px",
            }}
          >
            <img
              src={logo}
              width="38"
              height="38"
              alt="Online Banking"
              style={{
                display: "block",
              }}
            />
          </div>

          <b
            style={{
              color: "white",
              fontSize: "1.25rem",
              letterSpacing: "0.6px",
            }}
          >
            Finecare Banking
          </b>
        </Link>

        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: "#FFD700" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Left Menu - Always show for guests; show loans/cards to logged-in customers */}
          {((!isLoggedIn && true) || customer) && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 header-menu-nav">
              {(
                !isLoggedIn
                  ? ["Home", "About Us", "Accounts", "Loans", "Cards", "Contact Us"]
                  : ["Home", "Loans", "Cards", "Loan Status", "Card Status"]
              ).map((item, index) => {
                const routeMap = {
                  Home: "/",
                  "About Us": "/about",
                  Accounts: "/accounts",
                  Loans: "/loans",
                  "Loan Status": "/customer/loan/status",
                  "Card Status": "/customer/card/status",
                  Cards: "/cards",
                  "Contact Us": "/contact",
                };

                return (
                  <li className="nav-item" key={index}>
                    <Link
                      to={routeMap[item] || "/about"}
                      className="nav-link header-menu-link"
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <style>
            {`
              .header-menu-nav {
                gap: 4px;
              }

              .header-menu-link {
                color: #E5E7EB !important;
                font-weight: 500;
                padding: 8px 14px;
                border-radius: 8px;
                position: relative;
                transition: all 0.3s ease;
              }

              .header-menu-link::after {
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

              .header-menu-link:hover::after {
                width: 70%;
              }

              .header-menu-link:hover {
                background: rgba(255, 215, 0, 0.15);
                color: #ffffff !important;
              }
            `}
          </style>

          {/* Right Role Navigation */}
          <RoleNav />
        </div>
      </div>
    </nav>
  );
};

export default Header;
