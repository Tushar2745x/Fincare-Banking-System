import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const ViewBankAccounts = () => {
  let navigate = useNavigate();
  const [allAccounts, setAccounts] = useState([]);
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));

  const [accountNumber, setAccountNumber] = useState("");
  const [tempAccountNumber, setTempAccountNumber] = useState("");

  const bank_jwtToken = sessionStorage.getItem("bank-jwtToken");

  const [updateBankAccountStatusRequest, setUpdateBankAccountStatusRequest] =
    useState({
      accountId: "",
      status: "",
    });

  const retrieveAllAccounts = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/bank/account/fetch/bankwise?bankId=" +
        bank.bank.id,
      {
        headers: {
          Authorization: "Bearer " + bank_jwtToken,
        },
      }
    );
    return response.data;
  };

  const retrieveAllAccountsByBankAccount = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/bank/account/search?bankId=" +
        bank.bank.id +
        "&accountNumber=" +
        accountNumber,
      {
        headers: {
          Authorization: "Bearer " + bank_jwtToken,
        },
      }
    );
    return response.data;
  };

  useEffect(() => {
    if (accountNumber !== "") {
      const getAllCustomersByName = async () => {
        const bankAccounts = await retrieveAllAccountsByBankAccount();
        if (bankAccounts) {
          setAccounts(bankAccounts.accounts);
        }
      };
      getAllCustomersByName();
    } else {
      const getAllAccounts = async () => {
        const bankAccounts = await retrieveAllAccounts();
        if (bankAccounts) {
          setAccounts(bankAccounts.accounts);
        }
      };
      getAllAccounts();
    }
  }, [accountNumber]);

  const searchBankAccountsByAccountNumber = (e) => {
    e.preventDefault();
    setAccountNumber(tempAccountNumber);
  };

  const viewAccountDetails = (customer) => {
    navigate("/customer/bank/account/detail", { state: customer });
  };

  const viewAccountStatement = (customer) => {
    navigate("/customer/bank/account/statement", { state: customer });
  };

  const openAccount = (accountId) => {
    updateBankAccountStatusRequest.accountId = accountId;
    updateBankAccountStatusRequest.status = "Open";

    fetch("http://localhost:8080/api/bank/account/update/status", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + bank_jwtToken,
      },
      body: JSON.stringify(updateBankAccountStatusRequest),
    })
      .then((r) => r.json())
      .then((res) => {
        res.success
          ? toast.success(res.responseMessage)
          : toast.error("It seems server is down");
        setTimeout(() => window.location.reload(true), 1000);
      })
      .catch(() => {
        toast.error("It seems server is down");
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  const lockAccount = (accountId) => {
    updateBankAccountStatusRequest.accountId = accountId;
    updateBankAccountStatusRequest.status = "Lock";

    fetch("http://localhost:8080/api/bank/account/update/status", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + bank_jwtToken,
      },
      body: JSON.stringify(updateBankAccountStatusRequest),
    })
      .then((r) => r.json())
      .then((res) => {
        res.success
          ? toast.success(res.responseMessage)
          : toast.error("It seems server is down");
        setTimeout(() => window.location.reload(true), 1000);
      })
      .catch(() => {
        toast.error("It seems server is down");
        setTimeout(() => window.location.reload(true), 1000);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "#f8f9ff",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          borderRadius: "16px",
          background: "#ffffff",
        }}
      >
        {/* HEADER */}
        <div
          className="text-center p-4"
          style={{
            background: "linear-gradient(90deg, #4b0082, #6a1b9a, #ffcc00)",
            color: "#fff",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <h2 className="fw-bold mb-0">🏦 Bank Accounts Dashboard</h2>
        </div>

        {/* SEARCH */}
        <div className="p-4">
          <form className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="fw-semibold">Account Number</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter account number"
                onChange={(e) => setTempAccountNumber(e.target.value)}
                value={tempAccountNumber}
                style={{
                  borderRadius: "10px",
                  border: "2px solid #6a1b9a",
                }}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn w-100"
                onClick={searchBankAccountsByAccountNumber}
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
                <th>Account</th>
                <th>IFSC</th>
                <th>Type</th>
                <th>Details</th>
                <th>Status</th>
                <th>Action</th>
                <th>Statement</th>
              </tr>
            </thead>
            <tbody>
              {allAccounts.map((account, i) => (
                <motion.tr
                  key={account.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ backgroundColor: "#fff7d6" }}
                >
                  <td className="fw-semibold">{account.user.name}</td>
                  <td>{account.bank.name}</td>
                  <td>{account.number}</td>
                  <td>{account.ifscCode}</td>
                  <td>{account.type}</td>

                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => viewAccountDetails(account.user)}
                      style={{
                        background: "#6a1b9a",
                        color: "#fff",
                      }}
                    >
                      View
                    </button>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        account.status === "Open"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>

                  <td>
                    {account.status === "Open" ? (
                      <button
                        className="btn btn-sm"
                        onClick={() => lockAccount(account.id)}
                        style={{
                          background: "#ffcc00",
                          fontWeight: "bold",
                        }}
                      >
                        Lock
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm"
                        onClick={() => openAccount(account.id)}
                        style={{
                          background: "#6a1b9a",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Open
                      </button>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => viewAccountStatement(account.user)}
                      style={{
                        background: "#6a1b9a",
                        color: "#fff",
                      }}
                    >
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <ToastContainer />
      </div>
    </motion.div>
  );
};

export default ViewBankAccounts;
