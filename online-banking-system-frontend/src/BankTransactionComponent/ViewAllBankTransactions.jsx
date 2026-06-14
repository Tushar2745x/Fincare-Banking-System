import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ViewAllBankTransactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const retrieveAllTransactions = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/bank/transaction/all",
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
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
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  return (
    <div
      style={{
        backgroundColor: "#eef7f6",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <div className="mt-2">
        <div
          className="card ms-5 me-5 mb-5"
          style={{
            height: "45rem",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            className="card-header text-center"
            style={{
              background: "linear-gradient(90deg, #8b124c, #2c2f6c)",
              color: "#fff",
              borderTopLeftRadius: "18px",
              borderTopRightRadius: "18px",
            }}
          >
            <h2 className="mb-0">All Customer Transactions</h2>
          </div>

          {/* Body */}
          <div
            className="card-body"
            style={{
              backgroundColor: "#ffffff",
              overflowY: "auto",
            }}
          >
            <div className="table-responsive mt-3">
              <table className="table table-hover text-center align-middle">
                <thead
                  style={{
                    backgroundColor: "#2c2f6c",
                    color: "#fff",
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
                  {allTransactions.map((transaction) => {
                    return (
                      <tr key={transaction.id}>
                        <td><b>{transaction.transactionId}</b></td>
                        <td><b>{transaction.bank.name}</b></td>
                        <td><b>{transaction.user.name}</b></td>
                        <td><b>{transaction.bankAccount.number}</b></td>
                        <td><b>{transaction.type}</b></td>
                        <td><b>{transaction.amount}</b></td>

                        <td>
                          {(() => {
                            if (transaction.type === "Account Transfer") {
                              return (
                                <b>
                                  {transaction.destinationBankAccount.bank.name}
                                </b>
                              );
                            } else {
                              return <b>---</b>;
                            }
                          })()}
                        </td>

                        <td>
                          {(() => {
                            if (transaction.type === "Account Transfer") {
                              return (
                                <b>
                                  {transaction.destinationBankAccount.number}
                                </b>
                              );
                            } else {
                              return <b>---</b>;
                            }
                          })()}
                        </td>

                        <td><b>{transaction.narration}</b></td>
                        <td>
                          <b>
                            {formatDateFromEpoch(
                              transaction.transactionTime
                            )}
                          </b>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllBankTransactions;
