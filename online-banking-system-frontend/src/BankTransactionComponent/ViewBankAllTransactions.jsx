import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ViewBankAllTransactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));
  const bank_jwtToken = sessionStorage.getItem("bank-jwtToken");

  const retrieveAllTransactions = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/bank/transaction/all/customer/fetch?bankId=" +
        bank.bank.id,
      {
        headers: {
          Authorization: "Bearer " + bank_jwtToken,
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  useEffect(() => {
    const getAllTransactions = async () => {
      const transactions = await retrieveAllTransactions();
      if (transactions) {
        setAllTransactions(transactions.bankTransactions);
      }
    };
    getAllTransactions();
  }, []);

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString();
  };

  return (
    <div
      style={{
        backgroundColor: "#E6F8F9",
        minHeight: "100vh",
        padding: "30px 15px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <style>{`
        .transactions-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .transactions-header {
          background: linear-gradient(90deg, #8B0F50, #B5175A);
          color: white;
          padding: 18px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .transactions-body {
          padding: 20px;
          max-height: 75vh;
          overflow-y: auto;
        }

        table {
          border-collapse: separate;
          border-spacing: 0;
        }

        .transactions-table th {
          position: sticky;
          top: 0;
          background: #8B0F50;
          color: white;
          font-size: 0.9rem;
          padding: 12px;
          border-bottom: 2px solid #ffffff;
          z-index: 5;
        }

        .transactions-table td {
          font-size: 0.9rem;
          padding: 12px;
          background: #ffffff;
          border-bottom: 1px solid #e6e6e6;
          white-space: nowrap;
        }

        .transactions-table tbody tr:hover {
          background-color: #FDECEF;
          transition: background-color 0.2s ease-in-out;
        }

        .credit {
          color: #28A745;
          font-weight: 600;
        }

        .debit {
          color: #DC3545;
          font-weight: 600;
        }

        .table-responsive {
          border-radius: 12px;
          overflow-x: auto;
        }
      `}</style>

      <div className="transactions-card">
        <div className="transactions-header text-center">
          <h3 className="mb-0">All Customer Transactions</h3>
        </div>

        <div className="transactions-body">
          <div className="table-responsive">
            <table className="table transactions-table text-center">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Source Bank</th>
                  <th>Customer</th>
                  <th>Account No</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Recipient Bank</th>
                  <th>Recipient Acc</th>
                  <th>Narration</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td><b>{transaction.transactionId}</b></td>
                    <td>{transaction.bank.name}</td>
                    <td>{transaction.user.name}</td>
                    <td>{transaction.bankAccount.number}</td>
                    <td>{transaction.type}</td>
                    <td
                      className={
                        transaction.type === "Credit" ? "credit" : "debit"
                      }
                    >
                      ₹ {transaction.amount}
                    </td>
                    <td>
                      {transaction.type === "Account Transfer"
                        ? transaction.destinationBankAccount.bank.name
                        : "---"}
                    </td>
                    <td>
                      {transaction.type === "Account Transfer"
                        ? transaction.destinationBankAccount.number
                        : "---"}
                    </td>
                    <td>{transaction.narration}</td>
                    <td>{formatDateFromEpoch(transaction.transactionTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBankAllTransactions;
