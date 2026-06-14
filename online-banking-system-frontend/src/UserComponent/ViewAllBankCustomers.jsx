import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAllBankCustomers = () => {
  let navigate = useNavigate();
  const [allCustomer, setAllCustomer] = useState([]);

  const [customerName, setCustomerNumber] = useState("");
  const [tempCustomerName, setTempCustomerName] = useState("");

  const [updateUserStatusRequest, setUpdateUserStatusRequest] = useState({
    userId: "",
    status: "",
  });

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveBankAllCustomerByName = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/all/customer/search?" +
        "customerName=" +
        customerName,
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    return response.data;
  };

  const retrieveAllCustomers = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/role?role=CUSTOMER",
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    return response.data;
  };

  useEffect(() => {
    if (customerName !== "") {
      const getAllCustomersByName = async () => {
        const customers = await retrieveBankAllCustomerByName();
        if (customers) setAllCustomer(customers.users);
      };
      getAllCustomersByName();
    } else {
      const getAllCustomers = async () => {
        const customers = await retrieveAllCustomers();
        if (customers) setAllCustomer(customers.users);
      };
      getAllCustomers();
    }
  }, [customerName]);

  const searchBankCustomersByName = (e) => {
    e.preventDefault();
    setCustomerNumber(tempCustomerName);
  };

  const viewAccountDetails = (customer) => {
    navigate("/customer/bank/account/detail", { state: customer });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-slide">
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>All Branch Customers</h3>
          <p style={styles.subText}>Customer Account & Status Overview</p>
        </div>

        <div style={styles.body}>
          {/* Search Section */}
          <form className="row g-3 align-items-end mb-3">
            <div className="col-md-4">
              <label style={styles.label}>Customer Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter customer name..."
                onChange={(e) => setTempCustomerName(e.target.value)}
                value={tempCustomerName}
              />
            </div>

            <div className="col-md-2">
              <button
                type="submit"
                style={styles.searchBtn}
                onClick={searchBankCustomersByName}
              >
                Search
              </button>
            </div>
          </form>

          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle text-center">
              <thead style={styles.thead}>
                <tr>
                  <th>Customer</th>
                  <th>Bank</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Street</th>
                  <th>City</th>
                  <th>Pincode</th>
                  <th>Account</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allCustomer.map((customer) => (
                  <tr key={customer.id} style={styles.row}>
                    <td><b>{customer.name}</b></td>
                    <td>{customer.bank.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.gender}</td>
                    <td>{customer.contact}</td>
                    <td>{customer.street}</td>
                    <td>{customer.city}</td>
                    <td>{customer.pincode}</td>
                    <td>
                      {customer.isAccountLinked === "Yes" ? (
                        <button
                          style={styles.viewBtn}
                          onClick={() => viewAccountDetails(customer)}
                        >
                          View Account
                        </button>
                      ) : (
                        <b style={{ color: "#c0392b" }}>NOT LINKED</b>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          color:
                            customer.status === "Active"
                              ? "#000301ff"
                              : "#c0392b",
                          fontWeight: "1500",
                        }}
                      >
                        {customer.status}
                      </span>
                    </td>
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
            animation: fadeSlide 0.8s ease-in-out;
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
  },
  body: {
    padding: "20px",
    maxHeight: "40rem",
    overflowY: "auto",
  },
  label: {
    fontWeight: "600",
    color: "#0b1c3d",
  },
  thead: {
    background: "#8b1538",
    color: "#fff",
  },
  row: {
    fontSize: "14px",
  },
  searchBtn: {
    background: "#8b1538",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
  },
  viewBtn: {
    background: "#0b1c3d",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
  },
};

export default ViewAllBankCustomers;
