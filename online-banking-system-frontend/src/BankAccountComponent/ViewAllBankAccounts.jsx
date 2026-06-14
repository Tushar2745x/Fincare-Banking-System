import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAllBankAccounts = () => {
  let navigate = useNavigate();
  const [allAccounts, setAccounts] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [tempAccountNumber, setTempAccountNumber] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const [updateBankAccountStatusRequest, setUpdateBankAccountStatusRequest] =
    useState({
      accountId: "",
      status: "",
    });

  const retrieveAllAccounts = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/bank/account/fetch/all",
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    return response.data;
  };

  const retrieveAllAccountsByBankAccount = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/bank/account/search/all?accountNumber=" +
        accountNumber,
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
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

  return (
    <div
      style={{
        backgroundColor: "#eef7f6",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <div className="container-fluid">
        <div
          className="card ms-4 me-4 mb-5"
          style={{
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            height: "45rem",
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
            <h2 className="mb-0">All Branch Accounts</h2>
          </div>

          {/* Body */}
          <div
            className="card-body"
            style={{
              backgroundColor: "#ffffff",
              overflowY: "auto",
            }}
          >
            {/* Search */}
            <div className="row mb-3">
              <div className="col">
                <form className="row g-3 align-items-end">
                  <div className="col-auto">
                    <label>
                      <b>Account Number</b>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter account no..."
                      onChange={(e) => setTempAccountNumber(e.target.value)}
                      value={tempAccountNumber}
                      required
                    />
                  </div>

                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn btn-lg"
                      style={{
                        backgroundColor: "#8b124c",
                        color: "#fff",
                      }}
                      onClick={searchBankAccountsByAccountNumber}
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover text-center align-middle">
                <thead
                  style={{
                    backgroundColor: "#2c2f6c",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th>Customer Name</th>
                    <th>Bank Name</th>
                    <th>Account No.</th>
                    <th>IFSC Code</th>
                    <th>Account Type</th>
                    <th>Complete Detail</th>
                    <th>Status</th>
                    <th>Statement</th>
                  </tr>
                </thead>

                <tbody>
                  {allAccounts.map((account) => (
                    <tr key={account.id}>
                      <td><b>{account.user.name}</b></td>
                      <td>{account.bank.name}</td>
                      <td>{account.number}</td>
                      <td>{account.ifscCode}</td>
                      <td>{account.type}</td>

                      <td>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#8b124c",
                            color: "#fff",
                          }}
                          onClick={() => viewAccountDetails(account.user)}
                        >
                          View Detail
                        </button>
                        <ToastContainer />
                      </td>

                      <td><b>{account.status}</b></td>

                      <td>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#8b124c",
                            color: "#fff",
                          }}
                          onClick={() => viewAccountStatement(account.user)}
                        >
                          View
                        </button>
                        <ToastContainer />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllBankAccounts;
