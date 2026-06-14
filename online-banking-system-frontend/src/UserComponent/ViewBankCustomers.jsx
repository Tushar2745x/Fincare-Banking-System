import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewBankCustomers = () => {
  let navigate = useNavigate();
  const [allCustomer, setAllCustomer] = useState([]);
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));

  const [customerName, setCustomerNumber] = useState("");
  const [tempCustomerName, setTempCustomerName] = useState("");
  const bank_jwtToken = sessionStorage.getItem("bank-jwtToken");

  const [updateUserStatusRequest, setUpdateUserStatusRequest] = useState({
    userId: "",
    status: "",
  });

  const retrieveAllCustomers = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/bank/customers?bankId=" + bank.bank.id,
      { headers: { Authorization: "Bearer " + bank_jwtToken } }
    );
    return response.data;
  };

  const retrieveBankAllCustomerByName = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/user/bank/customer/search?bankId=${bank.bank.id}&customerName=${customerName}`,
      { headers: { Authorization: "Bearer " + bank_jwtToken } }
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

  const viewAccountDetails = (customer) =>
    navigate("/customer/bank/account/detail", { state: customer });

  const addBankAccountPage = (customer) =>
    navigate("/bank/customer/account/add", { state: customer });

  const activateUser = (userId) => {
    updateUserStatusRequest.userId = userId;
    updateUserStatusRequest.status = "Active";

    fetch("http://localhost:8080/api/user/update/status", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + bank_jwtToken,
      },
      body: JSON.stringify(updateUserStatusRequest),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, { position: "top-center", autoClose: 1000 });
          setTimeout(() => window.location.reload(true), 1000);
        } else {
          toast.error("Server error. Please try again.", { position: "top-center", autoClose: 1000 });
          setTimeout(() => window.location.reload(true), 1000);
        }
      })
      .catch(() => {
        toast.error("Server seems down!", { position: "top-center", autoClose: 1000 });
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  const deactivateUser = (userId) => {
    updateUserStatusRequest.userId = userId;
    updateUserStatusRequest.status = "Deactivated";

    fetch("http://localhost:8080/api/user/update/status", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + bank_jwtToken,
      },
      body: JSON.stringify(updateUserStatusRequest),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, { position: "top-center", autoClose: 1000 });
          setTimeout(() => window.location.reload(true), 1000);
        } else {
          toast.error("Server error. Please try again.", { position: "top-center", autoClose: 1000 });
          setTimeout(() => window.location.reload(true), 1000);
        }
      })
      .catch(() => {
        toast.error("Server seems down!", { position: "top-center", autoClose: 1000 });
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  return (
    <div style={{ background: "#f6f7ff", minHeight: "100vh", padding: "30px" }}>
      <div
        className="card shadow-lg border-0 mx-auto"
        style={{
          maxWidth: "1500px",
          borderRadius: "18px",
          background: "#ffffff",
        }}
      >
        {/* HEADER */}
        <div
          className="text-center py-4"
          style={{
            background: "linear-gradient(90deg, #4b0082, #6a1b9a, #ffcc00)",
            color: "#fff",
            borderTopLeftRadius: "18px",
            borderTopRightRadius: "18px",
          }}
        >
          <h2 className="fw-bold mb-0">🏦 Bank Customers Dashboard</h2>
          <p className="mb-0 mt-1">
            Manage customers of <b>{bank.bank.name}</b>
          </p>
        </div>

        {/* SEARCH */}
        <div className="p-4">
          <form
            className="row g-3 justify-content-center"
            onSubmit={searchBankCustomersByName}
          >
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search by customer name"
                onChange={(e) => setTempCustomerName(e.target.value)}
                value={tempCustomerName}
                style={{
                  borderRadius: "10px",
                  border: "2px solid #6a1b9a",
                }}
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn px-4"
                style={{
                  background: "linear-gradient(90deg, #6a1b9a, #ffcc00)",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "10px",
                }}
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="table-responsive px-4 pb-4">
          <table className="table table-hover align-middle text-center">
            <thead
              style={{
                background: "#f1f1fb",
                color: "#4b0082",
                fontWeight: "bold",
              }}
            >
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allCustomer.map((customer) => (
                <tr key={customer.id}>
                  <td className="fw-semibold">{customer.name}</td>
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
                        onClick={() => viewAccountDetails(customer)}
                        className="btn btn-sm"
                        style={{ background: "#6a1b9a", color: "#fff" }}
                      >
                        View Account
                      </button>
                    ) : (
                      <button
                        onClick={() => addBankAccountPage(customer)}
                        className="btn btn-sm"
                        style={{ background: "#ffcc00", fontWeight: "bold" }}
                      >
                        Add Account
                      </button>
                    )}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        customer.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td>
                    {customer.status === "Active" ? (
                      <button
                        onClick={() => deactivateUser(customer.id)}
                        className="btn btn-sm"
                        style={{ background: "#dc3545", color: "#fff" }}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => activateUser(customer.id)}
                        className="btn btn-sm"
                        style={{ background: "#6a1b9a", color: "#fff" }}
                      >
                        Activate
                      </button>
                    )}
                    <ToastContainer />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewBankCustomers;
