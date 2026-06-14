import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ViewBankManagers = () => {
  const [allManagers, setAllManagers] = useState([]);

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveAllManagers = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/role?role=BANK",
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    return response.data;
  };

  useEffect(() => {
    const getAllBanks = async () => {
      const managers = await retrieveAllManagers();
      if (managers) {
        setAllManagers(managers.users);
      }
    };
    getAllBanks();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-slide">
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>All Branch Managers</h3>
          <p style={styles.subText}>Authorized Banking Professionals</p>
        </div>

        <div style={styles.body}>
          <div className="table-responsive">
            <table style={styles.table} className="table align-middle">
              <thead style={styles.thead}>
                <tr>
                  <th>Manager Name</th>
                  <th>Bank Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Street</th>
                  <th>City</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                {allManagers.map((manager) => (
                  <tr key={manager.id} style={styles.row}>
                    <td><b>{manager.name}</b></td>
                    <td><b>{manager.bank ? manager.bank.name : "NA"}</b></td>
                    <td>{manager.email}</td>
                    <td>{manager.gender}</td>
                    <td>{manager.contact}</td>
                    <td>{manager.street}</td>
                    <td>{manager.city}</td>
                    <td>{manager.pincode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Animation + Hover */}
      <style>
        {`
          .fade-slide {
            animation: fadeSlide 0.9s ease-in-out;
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

          table tbody tr:hover {
            background-color: #f5eef2;
            transition: 0.3s ease;
          }
        `}
      </style>
    </div>
  );
};

/* -------- Banking UI Styles (Maroon–Navy) -------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    padding: "30px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(90deg, #5b0f2e, #0b1c3d)",
    color: "#ffffff",
    padding: "20px",
    textAlign: "center",
  },
  subText: {
    fontSize: "13px",
    opacity: 0.85,
    marginTop: "4px",
  },
  body: {
    padding: "20px",
    maxHeight: "40rem",
    overflowY: "auto",
  },
  table: {
    width: "100%",
    textAlign: "center",
    fontSize: "14px",
  },
  thead: {
    background: "#8b1538",
    color: "#ffffff",
  },
  row: {
    verticalAlign: "middle",
  },
};

export default ViewBankManagers;
