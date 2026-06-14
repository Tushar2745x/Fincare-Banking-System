import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();

  const bank = JSON.parse(sessionStorage.getItem("active-bank"));

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    street: "",
    city: "",
    pincode: "",
    roles: "BANK",
    age: "",
    gender: "",
    bankId: "",
  });

  useEffect(() => {
    // No need to check URL, always BANK
  }, []);

  const handleUserInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = (e) => {
    e.preventDefault();

    if (
      user.name === "" ||
      user.email === "" ||
      user.password === "" ||
      user.contact === "" ||
      user.street === "" ||
      user.city === "" ||
      user.pincode === "" ||
      user.roles === "" ||
      user.age === "" ||
      user.gender === "0"
    ) {
      toast.error("Please fill all the mandatory fields", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    let jwtToken;

    if (user.roles === "BANK") {
      jwtToken = sessionStorage.getItem("admin-jwtToken");
    }

    fetch("http://localhost:8080/api/user/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
      body: JSON.stringify(user),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });

            if (user.roles === "BANK") {
              setTimeout(() => navigate("/admin/bank/register"), 1000);
            }
          } else {
            toast.error(res.responseMessage, {
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
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setUser({
      name: "",
      email: "",
      password: "",
      contact: "",
      street: "",
      city: "",
      pincode: "",
      roles: "BANK",
      age: "",
      gender: "0",
    });
    window.location.reload(true);
  };

  return (
    <div
      style={{
        backgroundColor: "#E6F8F9",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <style>{`
        .register-card {
          max-width: 900px;
          margin: auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }

        .register-header {
          background: linear-gradient(90deg, #8B0F50, #B5175A);
          color: white;
          padding: 18px;
          text-align: center;
          font-weight: 600;
          border-radius: 16px 16px 0 0;
        }

        .form-label {
          font-weight: 600;
        }

        .form-control {
          border-radius: 8px;
          padding: 10px;
        }

        .btn-theme {
          background: linear-gradient(90deg, #8B0F50, #B5175A);
          color: white;
          border-radius: 8px;
          padding: 10px 22px;
          border: none;
        }

        .btn-theme:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="register-card">
        <div className="register-header">
          <h5 className="mb-0">Register Bank</h5>
        </div>

        <div className="card-body p-4">
          <form className="row g-3" onSubmit={saveUser} onReset={handleReset}>
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={user.name} onChange={handleUserInput} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={user.email} onChange={handleUserInput} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={user.password} onChange={handleUserInput} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select className="form-control" name="gender" onChange={handleUserInput}>
                <option value="0">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Contact</label>
              <input type="number" className="form-control" name="contact" value={user.contact} onChange={handleUserInput} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input type="number" className="form-control" name="age" value={user.age} onChange={handleUserInput} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Street</label>
              <textarea className="form-control" rows="3" name="street" value={user.street} onChange={handleUserInput} />
            </div>

            <div className="col-md-6">
              <label className="form-label">City</label>
              <input type="text" className="form-control" name="city" value={user.city} onChange={handleUserInput} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Pincode</label>
              <input type="number" className="form-control" name="pincode" value={user.pincode} onChange={handleUserInput} />
            </div>

            <div className="col-12 text-center mt-3">
              <button type="submit" className="btn btn-theme me-3">
                Register Bank
              </button>
              <button type="reset" className="btn btn-theme">
                Reset Form
              </button>
            </div>

            <ToastContainer />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
