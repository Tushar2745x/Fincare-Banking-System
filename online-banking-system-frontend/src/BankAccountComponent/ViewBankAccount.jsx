import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const SPENDING_TYPES = ["Withdraw", "Account Transfer"];
const INCOME_TYPES = ["Deposit", "Loan Disbursement"];

const PIE_COLORS = {
  Withdraw: "#c2185b",
  Deposit: "#2e7d32",
  "Account Transfer": "#e65100",
  "Loan Disbursement": "#1565c0",
};

const PIE_FALLBACK_COLORS = ["#c2185b", "#2e7d32", "#e65100", "#1565c0", "#6a1b9a"];

const ALL_TRANSACTION_TYPES = [
  "Withdraw",
  "Deposit",
  "Account Transfer",
  "Loan Disbursement",
];

const ViewBankAccount = () => {
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
  const [bankAccount, setBankAccount] = useState({});

  const [amountToDeposit, setAmountToDeposit] = useState("");
  const [amountToWithdraw, setAmountToWithdraw] = useState("");
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));

  const [statementDownloadRequest, setStatementDownloadRequest] = useState({
    startDate: "",
    endDate: "",
    accountId: "",
  });

  const [pieChartData, setPieChartData] = useState([]);
  const [chartSummary, setChartSummary] = useState({
    totalSpending: 0,
    totalIncome: 0,
    netFlow: 0,
    totalActivity: 0,
  });

  const [allTransactions, setAllTransactions] = useState([]);
  const [dateFilterRequest, setDateFilterRequest] = useState({
    startDate: "",
    endDate: "",
  });

  const adminToken = sessionStorage.getItem("admin-jwtToken");
  const bankToken = sessionStorage.getItem("bank-jwtToken");
  const customerToken = sessionStorage.getItem("customer-jwtToken");

  const jwtToken = adminToken || bankToken || customerToken;
  const isCustomerView = !!customerToken && !bankToken && !adminToken;

  const handleUserInput = (e) => {
    setStatementDownloadRequest({
      ...statementDownloadRequest,
      [e.target.name]: e.target.value,
    });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const retrieveBankAccount = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/bank/account/fetch/user?userId=" + customer.id,
      {
        headers: {
          Authorization: "Bearer " + jwtToken, // Replace with your actual JWT token
        },
      }
    );
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed
    return formattedDate;
  };

  const retrieveTransactions = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/bank/transaction/history?userId=${userId}`,
        {
          headers: {
            Authorization: "Bearer " + jwtToken,
          },
        }
      );
      return response.data.bankTransactions || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  const processTransactionsToChartData = (transactionList) => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleString("en-IN", { month: "short", year: "numeric" }),
        spending: 0,
        income: 0,
      });
    }

    transactionList.forEach((transaction) => {
      const timestamp = Number(transaction.transactionTime);
      if (Number.isNaN(timestamp)) return;

      const date = new Date(timestamp);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = months.find((item) => item.key === key);
      if (!bucket) return;

      const amount = Number(transaction.amount || 0);
      const type = transaction.type || "";

      if (SPENDING_TYPES.includes(type)) {
        bucket.spending += amount;
      } else if (INCOME_TYPES.includes(type)) {
        bucket.income += amount;
      }
    });

    const typeTotals = {
      Withdraw: 0,
      Deposit: 0,
      "Account Transfer": 0,
      "Loan Disbursement": 0,
    };

    const monthKeys = new Set(months.map((item) => item.key));

    transactionList.forEach((transaction) => {
      const timestamp = Number(transaction.transactionTime);
      if (Number.isNaN(timestamp)) return;

      const date = new Date(timestamp);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthKeys.has(key)) return;

      const amount = Number(transaction.amount || 0);
      const type = transaction.type || "";
      if (Object.prototype.hasOwnProperty.call(typeTotals, type)) {
        typeTotals[type] += amount;
      }
    });

    const totalSpending =
      typeTotals.Withdraw + typeTotals["Account Transfer"];
    const totalIncome = typeTotals.Deposit + typeTotals["Loan Disbursement"];
    const totalActivity = Object.values(typeTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    const pieData = ALL_TRANSACTION_TYPES.map((name) => {
      const value = typeTotals[name];
      return {
        name,
        value,
        percent:
          totalActivity > 0
            ? Number(((value / totalActivity) * 100).toFixed(1))
            : 0,
      };
    });

    return {
      pieData,
      summary: {
        totalSpending,
        totalIncome,
        netFlow: totalIncome - totalSpending,
        totalActivity,
      },
    };
  };

  const loadAccountData = useCallback(async () => {
    if (!customer?.id || !jwtToken) return;

    const bankAccounts = await retrieveBankAccount();
    if (!bankAccounts?.accounts?.[0]) return;

    setBankAccount(bankAccounts.accounts[0]);

    if (isCustomerView) {
      const txns = await retrieveTransactions(customer.id);
      setAllTransactions(txns); // Store all transactions
      const { pieData, summary } = processTransactionsToChartData(txns);
      setPieChartData(pieData);
      setChartSummary(summary);
    }
  }, [customer?.id, jwtToken, isCustomerView]);

  useEffect(() => {
    if (!customer?.id) {
      navigate("/user/login");
      return;
    }

    loadAccountData();
  }, [customer?.id, loadAccountData, navigate]);

  useEffect(() => {
    if (location.hash === "#spending-chart" && isCustomerView) {
      document.getElementById("customer-spending-chart")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [location.hash, isCustomerView, pieChartData]);

  const hasChartActivity = pieChartData.some((item) => item.value > 0);

  const accountDetails = useMemo(
    () => [
      { label: "Bank", value: customer?.bank?.name || "-" },
      { label: "Bank Account No.", value: bankAccount.number || "-" },
      { label: "IFSC Code", value: bankAccount.ifscCode || "-" },
      { label: "Customer", value: customer?.name || "-" },
      { label: "Customer Contact", value: customer?.contact || "-" },
      {
        label: "Creation Date",
        value: bankAccount.creationDate
          ? formatDateFromEpoch(bankAccount.creationDate)
          : "-",
      },
      {
        label: "Available Balance",
        value: formatCurrency(bankAccount.balance),
      },
      { label: "Account Status", value: bankAccount.status || "-" },
    ],
    [bankAccount, customer]
  );

  const renderPercentTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
      <div
        className="p-2 rounded"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #cbd5e1",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
        }}
      >
        <div className="fw-bold">{item.name}</div>
        <div>Share: {item.percent}%</div>
        <div>Amount: {formatCurrency(item.value)}</div>
      </div>
    );
  };

  const renderBarPercentLabel = ({ x, y, width, value }) => {
    if (value === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#334155"
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
      >
        {value}%
      </text>
    );
  };

  const convertToEpochTime = (dateString) => {
    const selectedDate = new Date(dateString);
    const epochTime = selectedDate.getTime();
    return epochTime;
  };

  const filterTransactionsByDateRange = (transactions, startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) {
      return transactions;
    }

    const startEpoch = convertToEpochTime(startDateStr);
    const endEpoch = convertToEpochTime(endDateStr);

    return transactions.filter((transaction) => {
      const txnTime = Number(transaction.transactionTime);
      return txnTime >= startEpoch && txnTime <= endEpoch;
    });
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilter = {
      ...dateFilterRequest,
      [name]: value,
    };
    setDateFilterRequest(updatedFilter);

    // Update chart with filtered data
    if (updatedFilter.startDate && updatedFilter.endDate) {
      const filteredTransactions = filterTransactionsByDateRange(
        allTransactions,
        updatedFilter.startDate,
        updatedFilter.endDate
      );
      const { pieData, summary } = processTransactionsToChartData(filteredTransactions);
      setPieChartData(pieData);
      setChartSummary(summary);
    }
  };

  const resetDateFilter = () => {
    setDateFilterRequest({ startDate: "", endDate: "" });
    const { pieData, summary } = processTransactionsToChartData(allTransactions);
    setPieChartData(pieData);
    setChartSummary(summary);
  };

  const downloadStatement = (e) => {
    e.preventDefault();

    fetch(
      "http://localhost:8080/api/bank/transaction/statement/download?accountId=" +
        bankAccount.id +
        "&startTime=" +
        convertToEpochTime(statementDownloadRequest.startDate) +
        "&endTime=" +
        convertToEpochTime(statementDownloadRequest.endDate),
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "bank_statement.pdf";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Download error:", error);
      });
  };

  const depositAmount = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/bank/transaction/deposit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
      body: JSON.stringify({
        sourceBankAccountId: bankAccount.id,
        amount: amountToDeposit,
      }),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          } else {
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          }
        });
      })
      .catch(() => {
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  const withdrawAmount = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/bank/transaction/withdraw", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken,
      },
      body: JSON.stringify({
        sourceBankAccountId: bankAccount.id,
        amount: amountToWithdraw,
      }),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          } else {
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          }
        });
      })
      .catch(() => {
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  return (
    <div
      style={{
        backgroundColor: "#e8f3f7",
        minHeight: "100vh",
        paddingBottom: "3rem",
        paddingTop: "1rem",
      }}
    >
      <div className="row ms-2 mt-2">
        <div className="col">
          <form className="row g-3 align-items-center">
            <div className="col-auto">
              <label
                htmlFor="startDate"
                style={{ fontWeight: "700", color: "#8b0f3a" }}
              >
                Select Start Date
              </label>
              <input
                type="datetime-local"
                className="form-control"
                name="startDate"
                placeholder="Start Date..."
                onChange={handleUserInput}
                value={statementDownloadRequest.startDate}
                required
                style={{
                  borderColor: "#8b0f3a",
                  boxShadow: "0 0 5px #8b0f3a33",
                  borderRadius: "6px",
                  minWidth: "200px",
                }}
              />
            </div>
            <div className="col-auto">
              <label
                htmlFor="endDate"
                style={{ fontWeight: "700", color: "#8b0f3a" }}
              >
                Select End Date
              </label>
              <input
                type="datetime-local"
                className="form-control"
                name="endDate"
                placeholder="End Date..."
                onChange={handleUserInput}
                value={statementDownloadRequest.endDate}
                required
                style={{
                  borderColor: "#8b0f3a",
                  boxShadow: "0 0 5px #8b0f3a33",
                  borderRadius: "6px",
                  minWidth: "200px",
                }}
              />
            </div>

            <div className="col-auto d-flex align-items-end">
              <button
                type="submit"
                className="btn"
                onClick={downloadStatement}
                style={{
                  backgroundColor: "#8b0f3a",
                  color: "white",
                  fontWeight: "600",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(139, 15, 58, 0.4)",
                  border: "none",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6a0a2f")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8b0f3a")
                }
              >
                Download Statement
              </button>
              <ToastContainer />
            </div>
          </form>

          <div className="my-0 row align-items-center justify-content-end me-4 pe-4 mt-3">
            <button
              className="btn"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: "#0d1b3d",
                color: "white",
                fontWeight: "1000",
                width: "5cm",     // length
                height: "2cm",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(13, 27, 61, 0.4)",
                border: "none",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#091331")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#0d1b3d")
              }
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className={`${isCustomerView ? "col-12" : "col-md-8"} mt-4 ms-3 me-3`}>
          {isCustomerView ? (
            <div
              id="customer-spending-chart"
              className="card form-card"
              style={{
                border: "none",
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(13, 27, 61, 0.12)",
                overflow: "hidden",
              }}
            >
              <div
                className="card-header text-center py-4"
                style={{
                  background:
                    "linear-gradient(135deg, #0d1b3d 0%, #1a237e 55%, #1565c0 100%)",
                  color: "white",
                  border: "none",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    letterSpacing: "0.12em",
                    opacity: 0.85,
                  }}
                >
                  CUSTOMER ACCOUNT OVERVIEW
                </div>
                <h3 className="mb-1 mt-2" style={{ fontWeight: "800" }}>
                  Bank Account Detail & Payment Spending
                </h3>
                <p className="mb-0" style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                  Account information with real-time transaction breakdown
                </p>
              </div>

              <div className="card-body" style={{ color: "#0d1b3d", padding: "2rem" }}>
                {/* Date Filter Section - Banking App Style */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "2rem",
                  }}
                >
                  <h6 className="mb-3 fw-bold" style={{ color: "#0d1b3d", fontSize: "1rem" }}>
                    📅 Filter Transactions by Date Range
                  </h6>
                  <div className="row g-3 align-items-end">
                    <div className="col-md-5">
                      <label
                        htmlFor="filterStartDate"
                        style={{ fontWeight: "600", color: "#0d1b3d", fontSize: "0.9rem", marginBottom: "0.5rem" }}
                      >
                        From Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="filterStartDate"
                        name="startDate"
                        onChange={handleDateFilterChange}
                        value={dateFilterRequest.startDate}
                        style={{
                          borderColor: "#cbd5e1",
                          borderRadius: "8px",
                          padding: "0.75rem",
                          fontSize: "0.95rem",
                          transition: "all 0.3s",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </div>

                    <div className="col-md-5">
                      <label
                        htmlFor="filterEndDate"
                        style={{ fontWeight: "600", color: "#0d1b3d", fontSize: "0.9rem", marginBottom: "0.5rem" }}
                      >
                        To Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="filterEndDate"
                        name="endDate"
                        onChange={handleDateFilterChange}
                        value={dateFilterRequest.endDate}
                        style={{
                          borderColor: "#cbd5e1",
                          borderRadius: "8px",
                          padding: "0.75rem",
                          fontSize: "0.95rem",
                          transition: "all 0.3s",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </div>

                    <div className="col-md-2 d-flex gap-2">
                      <button
                        onClick={resetDateFilter}
                        className="btn w-100"
                        style={{
                          backgroundColor: "#e0e7ff",
                          color: "#4f46e5",
                          fontWeight: "600",
                          borderRadius: "8px",
                          border: "1px solid #c7d2fe",
                          padding: "0.75rem",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#c7d2fe";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#e0e7ff";
                        }}
                        title="Reset to all transactions"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  {dateFilterRequest.startDate && dateFilterRequest.endDate && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "#dbeafe",
                        border: "1px solid #7dd3fc",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        color: "#0369a1",
                      }}
                    >
                      ✓ Showing transactions from <strong>{new Date(dateFilterRequest.startDate).toLocaleString()}</strong> to <strong>{new Date(dateFilterRequest.endDate).toLocaleString()}</strong>
                    </div>
                  )}
                </div>

                {/* Account Details Section */}
                <div className="mb-4">
                  <h5 className="mb-3 fw-bold" style={{ color: "#8b0f3a", fontSize: "1.2rem" }}>
                    📋 Account Details
                  </h5>
                  <div className="row g-2">
                    {accountDetails.slice(0, 4).map(({ label, value }) => (
                      <div className="col-md-6 col-lg-3" key={label}>
                        <div
                          style={{
                            backgroundColor: "#f8fafc",
                            padding: "1rem",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(13, 27, 61, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" }}>
                            {label}
                          </div>
                          <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0d1b3d", wordBreak: "break-word" }}>
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Additional Details */}
                  <div className="row g-2 mt-2">
                    {accountDetails.slice(4).map(({ label, value }) => (
                      <div className="col-md-6 col-lg-3" key={label}>
                        <div
                          style={{
                            backgroundColor: "#f8fafc",
                            padding: "1rem",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(13, 27, 61, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" }}>
                            {label}
                          </div>
                          <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0d1b3d", wordBreak: "break-word" }}>
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Metrics - Enhanced with Banking Style */}
                <div className="row g-3 mb-4 mt-2">
                  <div className="col-md-6 col-lg-3">
                    <div
                      style={{
                        backgroundColor: "#e8f5e9",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        border: "2px solid #2e7d32",
                        textAlign: "center",
                        boxShadow: "0 4px 12px rgba(46, 125, 50, 0.15)",
                      }}
                    >
                      <div style={{ fontSize: "0.85rem", color: "#2e7d32", marginBottom: "0.5rem", fontWeight: "600" }}>
                        📈 Total Income
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#2e7d32" }}>
                        {formatCurrency(chartSummary.totalIncome)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3">
                    <div
                      style={{
                        backgroundColor: "#ffebee",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        border: "2px solid #c2185b",
                        textAlign: "center",
                        boxShadow: "0 4px 12px rgba(194, 24, 91, 0.15)",
                      }}
                    >
                      <div style={{ fontSize: "0.85rem", color: "#c2185b", marginBottom: "0.5rem", fontWeight: "600" }}>
                        📉 Total Spending
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#c2185b" }}>
                        {formatCurrency(chartSummary.totalSpending)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3">
                    <div
                      style={{
                        backgroundColor: chartSummary.netFlow >= 0 ? "#e3f2fd" : "#ffe0e0",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        border: `2px solid ${chartSummary.netFlow >= 0 ? "#1565c0" : "#d32f2f"}`,
                        textAlign: "center",
                        boxShadow: `0 4px 12px rgba(${chartSummary.netFlow >= 0 ? "21, 101, 192" : "211, 47, 47"}, 0.15)`,
                      }}
                    >
                      <div style={{ fontSize: "0.85rem", color: chartSummary.netFlow >= 0 ? "#1565c0" : "#d32f2f", marginBottom: "0.5rem", fontWeight: "600" }}>
                        {chartSummary.netFlow >= 0 ? "💰 Net Flow" : "⚠️ Net Flow"}
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800", color: chartSummary.netFlow >= 0 ? "#1565c0" : "#d32f2f" }}>
                        {formatCurrency(chartSummary.netFlow)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3">
                    <div
                      style={{
                        backgroundColor: "#f3e5f5",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        border: "2px solid #7b1fa2",
                        textAlign: "center",
                        boxShadow: "0 4px 12px rgba(123, 31, 162, 0.15)",
                      }}
                    >
                      <div style={{ fontSize: "0.85rem", color: "#7b1fa2", marginBottom: "0.5rem", fontWeight: "600" }}>
                        📊 Total Activity
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#7b1fa2" }}>
                        {formatCurrency(chartSummary.totalActivity)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Summary as Inverted Bar Graph */}
                <div className="mt-4">
                  <h5 className="mb-3 fw-bold" style={{ color: "#8b0f3a", fontSize: "1.2rem" }}>
                    📊 Transaction Summary
                    {dateFilterRequest.startDate && dateFilterRequest.endDate && (
                      <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.5rem", fontWeight: "400" }}>
                        (Filtered)
                      </span>
                    )}
                  </h5>

                  {!hasChartActivity && (
                    <div style={{
                      backgroundColor: "#e3f2fd",
                      border: "2px solid #1565c0",
                      borderRadius: "10px",
                      padding: "1.5rem",
                      textAlign: "center",
                      color: "#1565c0",
                    }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                        💭 No payment activity found
                      </div>
                      <div style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}>
                        {dateFilterRequest.startDate && dateFilterRequest.endDate 
                          ? "No transactions in the selected date range. Try adjusting your filters." 
                          : "No payment activity in the last 6 months."}
                      </div>
                    </div>
                  )}

                  {hasChartActivity && (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={pieChartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          type="number"
                          tick={{ fill: "#334155", fontSize: 12 }}
                          tickFormatter={(value) => {
                            if (value === 0) return "₹0";
                            if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                            if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                            return `₹${value.toFixed(0)}`;
                          }}
                          label={{
                            value: "Amount (₹)",
                            position: "bottom",
                            fill: "#334155",
                            fontSize: 12,
                            offset: 10,
                          }}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category"
                          tick={{ fill: "#334155", fontSize: 12 }}
                          width={140}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                          }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Bar dataKey="value" fill="#8884d8" radius={[0, 8, 8, 0]}>
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={
                                PIE_COLORS[entry.name] ||
                                PIE_FALLBACK_COLORS[
                                  index % PIE_FALLBACK_COLORS.length
                                ]
                              }
                            />
                          ))}
                          <LabelList 
                            dataKey="value" 
                            position="right"
                            formatter={(value) => {
                              if (value === 0) return "";
                              if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                              if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                              return `₹${value.toFixed(0)}`;
                            }}
                            fill="#334155"
                            fontSize={12}
                            fontWeight={600}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="card form-card"
              style={{
                borderColor: "#8b0f3a",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgb(139 15 58 / 0.2)",
              }}
            >
              <div
                className="card-header text-center"
                style={{
                  backgroundColor: "#0d1b3d",
                  color: "white",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  fontWeight: "700",
                  fontSize: "1.2rem",
                }}
              >
                Customer Bank Account Detail
              </div>
              <div className="card-body" style={{ color: "#0d1b3d" }}>
                <div className="row g-3">
                  {accountDetails.map(({ label, value }) => (
                    <div className="col-md-6 mb-3" key={label}>
                      <label
                        className="form-label"
                        style={{ fontWeight: "700", color: "#8b0f3a" }}
                      >
                        {label}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={value || ""}
                        readOnly
                        style={{
                          borderColor: "#8b0f3a",
                          borderRadius: "6px",
                          boxShadow: "0 0 6px #8b0f3a33",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {bank !== null && (
          <div className="col mt-4">
            <div className="container">
              <div
                className="card form-card"
                style={{
                  borderColor: "#8b0f3a",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgb(139 15 58 / 0.2)",
                }}
              >
                <div
                  className="card-header text-center"
                  style={{
                    backgroundColor: "#0d1b3d",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "1.3rem",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                >
                  Bank Deposit
                </div>
                <div className="card-body" style={{ color: "#0d1b3d" }}>
                  <form>
                    <div className="mb-3">
                      <label
                        htmlFor="amount"
                        className="form-label"
                        style={{ fontWeight: "700", color: "#8b0f3a" }}
                      >
                        Amount To Deposit
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        name="amount"
                        onChange={(e) => setAmountToDeposit(e.target.value)}
                        value={amountToDeposit}
                        style={{
                          borderColor: "#8b0f3a",
                          borderRadius: "6px",
                          boxShadow: "0 0 6px #8b0f3a33",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn"
                      onClick={depositAmount}
                      style={{
                        backgroundColor: "#8b0f3a",
                        color: "white",
                        fontWeight: "600",
                        padding: "0.5rem 1.5rem",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(139, 15, 58, 0.4)",
                        border: "none",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#6a0a2f")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#8b0f3a")
                      }
                    >
                      Deposit
                    </button>
                    <ToastContainer />
                  </form>
                </div>
              </div>

              <div
                className="card form-card mt-4"
                style={{
                  borderColor: "#8b0f3a",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgb(139 15 58 / 0.2)",
                }}
              >
                <div
                  className="card-header text-center"
                  style={{
                    backgroundColor: "#0d1b3d",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "1.3rem",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                >
                  Bank Withdraw
                </div>
                <div className="card-body" style={{ color: "#0d1b3d" }}>
                  <form>
                    <div className="mb-3">
                      <label
                        htmlFor="amount"
                        className="form-label"
                        style={{ fontWeight: "700", color: "#8b0f3a" }}
                      >
                        Amount To Withdraw
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        name="amount"
                        onChange={(e) => setAmountToWithdraw(e.target.value)}
                        value={amountToWithdraw}
                        style={{
                          borderColor: "#8b0f3a",
                          borderRadius: "6px",
                          boxShadow: "0 0 6px #8b0f3a33",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn"
                      onClick={withdrawAmount}
                      style={{
                        backgroundColor: "#8b0f3a",
                        color: "white",
                        fontWeight: "600",
                        padding: "0.5rem 1.5rem",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(139, 15, 58, 0.4)",
                        border: "none",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#6a0a2f")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#8b0f3a")
                      }
                    >
                      Withdraw
                    </button>
                    <ToastContainer />
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer
  style={{
    textAlign: "center",
    padding: "12px 0",
    color: "#000000ff",
    borderTop: "1px solid rgba(251, 0, 0, 0.15)",
    backgroundColor: "rgba(0,0,0,0.25)",
    position: "fixed",   // makes it stick to bottom of viewport
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,       // stay above other content
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
        color: "#ff0000ff",
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

export default ViewBankAccount;
