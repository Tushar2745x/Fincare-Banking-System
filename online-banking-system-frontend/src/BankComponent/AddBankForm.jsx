import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBankForm = () => {
  const [bankUsers, setBankUsers] = useState([]);

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveAllBankUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/fetch/bank/managers",
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bank managers:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getAllBankUsers = async () => {
      const allBankUsers = await retrieveAllBankUsers();
      if (allBankUsers) {
        setBankUsers(allBankUsers.users);
      }
    };
    getAllBankUsers();
  }, []);

  const [bank, setBank] = useState({
    name: "",
    code: "",
    address: "",
    phoneNumber: "",
    email: "",
    website: "",
    country: "",
    currency: "",
    userId: "",
  });

  const handleInput = (e) => {
    setBank({ ...bank, [e.target.name]: e.target.value });
  };

  const saveBank = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/bank/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(bank),
    })
      .then((result) =>
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, { autoClose: 1000 });
            setTimeout(() => window.location.reload(true), 1000);
          } else {
            toast.error("It seems server is down", { autoClose: 1000 });
            setTimeout(() => window.location.reload(true), 1000);
          }
        })
      )
      .catch(() => {
        toast.error("It seems server is down", { autoClose: 1000 });
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-slide">
        <div style={styles.header}>
          <h4 style={{ margin: 0 }}>Add Branch Details</h4>
          <p style={styles.subText}>Secure Banking Registration</p>
        </div>

        <form className="row g-4" style={styles.body}>
          {renderInput("Bank Name", "name", bank.name, handleInput)}
          {renderInput("Bank Code", "code", bank.code, handleInput)}

          <div className="col-md-6">
            <label style={styles.label}>Bank Manager</label>
            <select
              name="userId"
              onChange={handleInput}
              className="form-control"
              style={styles.input}
            >
              <option value="">Select Bank Manager</option>
              {bankUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {renderInput("Website", "website", bank.website, handleInput)}
          {renderTextarea("Bank Address", "address", bank.address, handleInput)}
          {renderInput("Email", "email", bank.email, handleInput, "email")}
          {renderInput("Phone Number", "phoneNumber", bank.phoneNumber, handleInput)}
          {renderInput("Country", "country", bank.country, handleInput)}
          {renderInput("Currency", "currency", bank.currency, handleInput)}

          <div className="col-12 text-center">
            <button style={styles.button} onClick={saveBank}>
              Register Bank
            </button>
          </div>
        </form>
        <ToastContainer position="top-center" />
      </div>

      {/* Animation CSS */}
      <style>
        {`
          .fade-slide {
            animation: fadeSlide 0.8s ease-in-out;
          }
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

/* ---------- Reusable Inputs ---------- */
const renderInput = (label, name, value, onChange, type = "text") => (
  <div className="col-md-6">
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="form-control"
      style={styles.input}
    />
  </div>
);

const renderTextarea = (label, name, value, onChange) => (
  <div className="col-md-6">
    <label style={styles.label}>{label}</label>
    <textarea
      name={name}
      rows="3"
      value={value}
      onChange={onChange}
      className="form-control"
      style={styles.input}
    />
  </div>
);

/* ---------- Styles (Maroon–Navy Banking Theme) ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },
  card: {
    width: "900px",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(90deg, #5b0f2e, #0b1c3d)",
    color: "#fff",
    padding: "22px",
    textAlign: "center",
  },
  subText: {
    fontSize: "13px",
    opacity: 0.85,
  },
  body: {
    padding: "30px",
  },
  label: {
    fontWeight: "600",
    marginBottom: "6px",
    color: "#0b1c3d",
  },
  input: {
    borderRadius: "10px",
    padding: "10px",
    border: "1px solid #dcdcdc",
  },
  button: {
    marginTop: "15px",
    padding: "12px 40px",
    background: "#8b1538",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    fontWeight: "600",
    transition: "0.3s",
  },
};

export default AddBankForm;
