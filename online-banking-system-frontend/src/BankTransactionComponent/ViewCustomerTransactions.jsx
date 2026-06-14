import { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ViewCustomerTransactions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const customer =
    location.state ||
    (() => {
      try {
        const raw = sessionStorage.getItem("active-customer");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

  const [allTransactions, setAllTransactions] = useState([]);
  const [accountBalance, setAccountBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const jwtToken =
    sessionStorage.getItem("admin-jwtToken") ||
    sessionStorage.getItem("bank-jwtToken") ||
    sessionStorage.getItem("customer-jwtToken");

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "₹ 0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString();
  };

  const loadCustomerData = useCallback(async () => {
    if (!customer?.id || !jwtToken) return;

    try {
      const headers = { Authorization: "Bearer " + jwtToken };

      const [txnRes, accountRes] = await Promise.all([
        axios.get(
          `http://localhost:8080/api/bank/transaction/history?userId=${customer.id}`,
          { headers }
        ),
        axios.get(
          `http://localhost:8080/api/bank/account/fetch/user?userId=${customer.id}`,
          { headers }
        ),
      ]);

      if (txnRes.data?.bankTransactions) {
        setAllTransactions(txnRes.data.bankTransactions);
      }

      const account = accountRes.data?.accounts?.[0];
      if (account) {
        setAccountBalance(account.balance);
      }

      setError("");
    } catch (err) {
      setError("Unable to load transaction history.");
    } finally {
      setLoading(false);
    }
  }, [customer?.id, jwtToken]);

  useEffect(() => {
    if (!customer?.id) {
      navigate("/user/login");
      return;
    }

    loadCustomerData();

    const intervalId = setInterval(loadCustomerData, 10000);
    const handleFocus = () => loadCustomerData();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [customer?.id, loadCustomerData, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#eef9f8",
      }}
    >
      <div className="mt-3">
        <div
          className="card form-card ms-5 me-5 mb-5"
          style={{
            height: "45rem",
            backgroundColor: "#ffffff",
            border: "2px solid #0b1437",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="card-header text-center"
            style={{
              background: "linear-gradient(90deg, #0b1437, #1a237e)",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "1.5rem",
              borderBottom: "3px solid #9c1348",
            }}
          >
            <div>Customer Transaction History</div>
            {accountBalance !== null && (
              <div style={{ fontSize: "1rem", fontWeight: "600", marginTop: "0.4rem" }}>
                Available Balance: {formatCurrency(accountBalance)}
              </div>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-center my-3">
            <button
              className="btn"
              style={{
                background: "linear-gradient(90deg, #9c1348, #c2185b)",
                color: "#ffffff",
                fontWeight: "bold",
                padding: "0.5rem 1.8rem",
                borderRadius: "8px",
                border: "none",
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>

          <div
            className="card-body"
            style={{
              overflowY: "auto",
              backgroundColor: "#ffffff",
            }}
          >
            {loading ? (
              <p className="text-center">Loading transactions...</p>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : allTransactions.length === 0 ? (
              <div className="alert alert-info text-center">
                No transactions found for this customer.
              </div>
            ) : (
              <div className="table-responsive mt-3">
                <table className="table table-hover text-center">
                  <thead
                    style={{
                      backgroundColor: "#0b1437",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    <tr>
                      <th>Transaction Id</th>
                      <th>Source Bank</th>
                      <th>Customer Name</th>
                      <th>Source Account</th>
                      <th>Transaction Type</th>
                      <th>Amount</th>
                      <th>Recipient Bank</th>
                      <th>Recipient Account</th>
                      <th>Narration</th>
                      <th>Transaction Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.map((transaction, index) => (
                      <tr
                        key={transaction.id}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f4f6fb",
                        }}
                      >
                        <td>
                          <b>{transaction.transactionId}</b>
                        </td>
                        <td>
                          <b>{transaction.bank.name}</b>
                        </td>
                        <td>
                          <b>{transaction.user.name}</b>
                        </td>
                        <td>
                          <b>{transaction.bankAccount.number}</b>
                        </td>
                        <td>
                          <b
                            style={{
                              color:
                                transaction.type === "Loan Disbursement"
                                  ? "#1565c0"
                                  : "inherit",
                            }}
                          >
                            {transaction.type}
                          </b>
                        </td>
                        <td>
                          <b
                            style={{
                              color:
                                transaction.type === "Loan Disbursement" ||
                                transaction.type === "Deposit"
                                  ? "#2e7d32"
                                  : transaction.type === "Withdraw"
                                    ? "#c62828"
                                    : "inherit",
                            }}
                          >
                            {formatCurrency(transaction.amount)}
                          </b>
                        </td>
                        <td>
                          {transaction.type === "Account Transfer" ? (
                            <b>{transaction.destinationBankAccount.bank.name}</b>
                          ) : (
                            <b>---</b>
                          )}
                        </td>
                        <td>
                          {transaction.type === "Account Transfer" ? (
                            <b>{transaction.destinationBankAccount.number}</b>
                          ) : (
                            <b>---</b>
                          )}
                        </td>
                        <td>
                          <b>{transaction.narration}</b>
                        </td>
                        <td>
                          <b>
                            {formatDateFromEpoch(transaction.transactionTime)}
                          </b>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "14px 0",
          background: "linear-gradient(90deg, #070d2b, #1a144f)",
          color: "#e5e7eb",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p className="mb-1">
          © {new Date().getFullYear()}{" "}
          <b style={{ color: "#ffcc00" }}>Full Stack Java Developer</b>. All Rights
          Reserved.
        </p>
        <p>
          Designed with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/tushar-galande-ab3648292/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#ffccd9",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Tushar Galande
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ViewCustomerTransactions;
