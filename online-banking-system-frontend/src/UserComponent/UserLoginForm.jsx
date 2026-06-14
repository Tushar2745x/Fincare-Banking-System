import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLoginForm = () => {
  const [loginRequest, setLoginRequest] = useState({});

  const handleUserInput = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
  };

  const loginAction = (e) => {
    fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            if (res.jwtToken !== null) {
              if (res.user.roles === "ADMIN") {
                sessionStorage.setItem("active-admin", JSON.stringify(res.user));
                sessionStorage.setItem("admin-jwtToken", res.jwtToken);
              } else if (res.user.roles === "CUSTOMER") {
                sessionStorage.setItem(
                  "active-customer",
                  JSON.stringify(res.user)
                );
                sessionStorage.setItem("customer-jwtToken", res.jwtToken);
              } else if (res.user.roles === "BANK") {
                sessionStorage.setItem("active-bank", JSON.stringify(res.user));
                sessionStorage.setItem("bank-jwtToken", res.jwtToken);
              }
            }

            if (res.jwtToken !== null) {
              toast.success(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
              });
              setTimeout(() => {
                window.location.href = "/home";
              }, 500);
            } else {
              toast.error(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
              });
            }
          } else {
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
            });
          }
        });
      })
      .catch(() => {
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
      });

    e.preventDefault();
  };

  const handleReset = (e) => {
    e.preventDefault();
    setLoginRequest({});
    window.location.reload(true);
  };

  return (
    <div className="page-wrapper">
      {/* Animated Background */}
      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      {/* LOGIN CARD */}
      <div className="center-wrapper">
        <div className="card login-card">
          <div className="card-header login-header">
            User Login
            <div className="sub-title">Secure Access</div>
          </div>

          <div className="card-body p-4">
            <form onSubmit={loginAction} onReset={handleReset}>
              <div className="mb-3">
                <label className="form-label fw-semibold">User Role</label>
                <select
                  name="role"
                  onChange={handleUserInput}
                  className="form-control clean-input"
                >
                  <option value="0">Select Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="BANK">Bank</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email ID</label>
                <input
                  type="email"
                  name="emailId"
                  value={loginRequest.emailId || ""}
                  onChange={handleUserInput}
                  className="form-control clean-input"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginRequest.password || ""}
                  onChange={handleUserInput}
                  className="form-control clean-input"
                />
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn primary-btn">
                  Login
                </button>
                <button type="reset" className="btn outline-btn">
                  Clear
                </button>
              </div>

              {loginRequest.role && loginRequest.role !== "0" && (
                <div className="text-center mt-3">
                  <span style={{ color: "#666" }}>Don't have an account? </span>
                  <Link
                    to={
                      loginRequest.role === "ADMIN"
                        ? "/user/admin/register"
                        : loginRequest.role === "CUSTOMER"
                        ? "/user/customer/register"
                        : "/user/bank/register"
                    }
                    style={{
                      color: "#0d1b3d",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Register here
                  </Link>
                </div>
              )}

              <ToastContainer />
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER (UNCHANGED) */}
      <footer
        style={{
          textAlign: "center",
          padding: "12px 0",
          color: "#000000ff",
          borderTop: "1px solid rgba(251, 0, 0, 0.15)",
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      >
        <p className="mb-1">
          © {new Date().getFullYear()} <b>Full Stack Java Developer</b>. All Rights
          Reserved.
        </p>
        <p className="footer-sub">
          Designed with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/tushar-galande-ab3648292/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FFD700",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Tushar Galande
          </a>
        </p>
      </footer>

      {/* STYLES */}
      <style>
        {`
        .page-wrapper {
          min-height: 100vh;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .center-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
        }

        /* Animated Background */
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.35;
          animation: float 10s infinite ease-in-out;
        }

        .circle1 {
          width: 280px;
          height: 280px;
          background: #2563eb;
          top: 10%;
          left: 10%;
        }

        .circle2 {
          width: 320px;
          height: 320px;
          background: #9333ea;
          bottom: 15%;
          right: 10%;
          animation-delay: 3s;
        }

        .circle3 {
          width: 220px;
          height: 220px;
          background: #db2777;
          top: 50%;
          right: 30%;
          animation-delay: 6s;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
          100% { transform: translateY(0px); }
        }

        /* Card */
        .login-card {
          width: 26rem;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
          animation: fadeUp 0.7s ease;
        }

        .login-header {
          background: linear-gradient(135deg, #1e3a8a, #7c3aed, #db2777);
          color: #fff;
          text-align: center;
          font-size: 1.4rem;
          font-weight: bold;
          border-radius: 16px 16px 0 0;
        }

        .sub-title {
          font-size: 0.85rem;
          font-weight: 400;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .clean-input {
          border-radius: 10px;
          padding: 10px;
        }

        .clean-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 6px rgba(124,58,237,0.4);
        }

        .primary-btn {
          background: linear-gradient(135deg, #1e3a8a, #7c3aed);
          color: #fff;
          padding: 8px 26px;
          border-radius: 10px;
          font-weight: 600;
        }

        .outline-btn {
          border: 2px solid #7c3aed;
          color: #7c3aed;
          padding: 8px 26px;
          border-radius: 10px;
          font-weight: 600;
          background: #fff;
        }
        `}
      </style>
    </div>
  );
};

export default UserLoginForm;
