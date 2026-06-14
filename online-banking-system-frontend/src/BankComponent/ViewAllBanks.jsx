import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ViewAllBanks = () => {
  const [allBanks, setAllBanks] = useState([]);

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveAllBanks = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/bank/fetch/all",
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
      const allBanks = await retrieveAllBanks();
      if (allBanks) {
        setAllBanks(allBanks.banks);
      }
    };
    getAllBanks();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-slide">
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>All Banks</h3>
          <p style={styles.subText}>Registered Banking Institutions</p>
        </div>

        <div style={styles.body}>
          <div className="table-responsive">
            <table style={styles.table} className="table align-middle">
              <thead style={styles.thead}>
                <tr>
                  <th>Bank</th>
                  <th>Code</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>Country</th>
                  <th>Currency</th>
                </tr>
              </thead>
              <tbody>
                {allBanks.map((bank) => (
                  <tr key={bank.id} style={styles.row}>
                    <td><b>{bank.name}</b></td>
                    <td>{bank.code}</td>
                    <td>{bank.address}</td>
                    <td>{bank.phoneNumber}</td>
                    <td>{bank.email}</td>
                    <td>{bank.website}</td>
                    <td>{bank.country}</td>
                    <td>{bank.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          .fade-slide {
            animation: fadeSlide 0.9s ease-in-out;
          }
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          table tbody tr:hover {
            background-color: #f6eef2;
            transition: 0.3s;
          }
        `}
      </style>
    </div>
  );
};

/* --------- Styles (Maroon–Navy Banking UI) --------- */
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
    color: "#fff",
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
  },
  thead: {
    background: "#8b1538",
    color: "#fff",
  },
  row: {
    fontSize: "14px",
  },
};

export default ViewAllBanks;
