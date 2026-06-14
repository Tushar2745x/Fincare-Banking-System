import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRegisterForm = () => {
  const [registerRequest, setRegisterRequest] = useState({});

  const handleUserInput = (e) => {
    setRegisterRequest({ ...registerRequest, [e.target.name]: e.target.value });
  };

  const loginAction = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/user/admin/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    })
      .then((result) =>
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => {
              window.location.href = "/user/login";
            }, 1000);
          } else {
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
            });
          }
        })
      )
      .catch(() => {
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
      });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setRegisterRequest({});
  };

  return (
    <>
      {/* Inline CSS */}
      <style>{`
        .admin-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          .admin-page {
  background: linear-gradient(
    180deg,
    #eef1f4 0%,
    #eaebe5ff 50%,
    #f3f4f6 100%
  );
}

        }

        .admin-card {
          width: 35rem;
          border-radius: 14px;
          animation: slideFade 0.8s ease-in-out;
        }

        .admin-header {
          background: linear-gradient(90deg, #1d2671, #c33764);
          color: white;
          border-radius: 14px 14px 0 0;
        }

        .custom-input {
          height: 44px;
          border-radius: 8px;
        }

        .custom-input:focus {
          border-color: #1d2671;
          box-shadow: 0 0 0 0.15rem rgba(29, 38, 113, 0.25);
        }

        .btn-primary {
          background: linear-gradient(90deg, #1d2671, #c33764);
          border: none;
        }

        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .admin-footer {
          margin-top: auto;
          background: #0f2027;
          color: white;
          padding: 10px 0;
          font-size: 14px;
        }

        .admin-footer a {
          color: #ffb703;
          text-decoration: none;
        }

        .admin-footer a:hover {
          text-decoration: underline;
        }

        @keyframes slideFade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="admin-page">
        <div className="container d-flex align-items-center justify-content-center flex-grow-1">
          <div className="card admin-card shadow-lg">
            <div className="card-header text-center admin-header">
              <h4 className="mb-0">Admin Registration</h4>
              <small>Secure Admin Access</small>
            </div>

            <div className="card-body">
              <form onSubmit={loginAction} onReset={handleReset}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email ID</label>
                  <input
                    type="email"
                    className="form-control custom-input"
                    name="email"
                    value={registerRequest.email || ""}
                    onChange={handleUserInput}
                    placeholder="Enter admin email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control custom-input"
                    name="password"
                    value={registerRequest.password || ""}
                    onChange={handleUserInput}
                    placeholder="Enter password"
                    autoComplete="on"
                    required
                  />
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-primary px-4">
                    Register
                  </button>
                  <button type="reset" className="btn btn-outline-secondary px-4">
                    Clear
                  </button>
                </div>

                <ToastContainer />
              </form>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <footer className="admin-footer text-center">
          <p className="mb-1">
            © {new Date().getFullYear()} <b>Full Stack Java Developer</b>. All
            Rights Reserved.
          </p>
          <p className="footer-sub">
            Designed with ❤️ by{" "}
            <a
              href="https://www.linkedin.com/in/tushar-galande-ab3648292/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tushar Galande
            </a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default AdminRegisterForm;
