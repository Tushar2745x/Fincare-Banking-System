import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const CustomerAccountFundTransfer = () => {
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  let customerToken = sessionStorage.getItem("customer-jwtToken");
  let navigate = useNavigate();

  const [transferRequest, setTransferRequest] = useState({
    userId: customer.id,
    bankId: customer.bank.id,
    amount: "",
    toBankAccount: "",
    toBankIfsc: "",
    accountTransferPurpose: "",
  });

  const handleInput = (e) => {
    setTransferRequest({
      ...transferRequest,
      [e.target.name]: e.target.value,
    });
  };

  const saveAccount = (e) => {
    fetch("http://localhost:8080/api/bank/transaction/account/transfer", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customerToken,
      },
      body: JSON.stringify(transferRequest),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => {
              navigate("/customer/bank/account/statement", {
                state: customer,
              });
            }, 1000);
          } else {
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => window.location.reload(true), 1000);
          }
        });
      })
      .catch(() => {
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => window.location.reload(true), 1000);
      });
    e.preventDefault();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#eef9f8",
      }}
    >
      <div className="d-flex align-items-center justify-content-center flex-grow-1 mt-4 mb-4">
        <div
          className="card"
          style={{
            width: "100rem",
            backgroundColor: "#ffffff",
            border: "2px solid #0b1437",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="card-header text-center"
            style={{
              background:
                "linear-gradient(90deg, #0b1437, #1a237e)",
              color: "#ffffff",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <h5 className="card-title fw-bold">
              Transfer Money
            </h5>
          </div>

          <div className="card-body" style={{ color: "#1f2937" }}>
            <form className="row g-3">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <b>Account Number</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="toBankAccount"
                  onChange={handleInput}
                  value={transferRequest.toBankAccount}
                  placeholder="Enter account number"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <b>IFSC Code</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="toBankIfsc"
                  onChange={handleInput}
                  value={transferRequest.toBankIfsc}
                  placeholder="Enter IFSC code"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <b>Amount</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="amount"
                  onChange={handleInput}
                  value={transferRequest.amount}
                  placeholder="Enter amount"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <b>Purpose</b>
                </label>
                <textarea
                  className="form-control"
                  name="accountTransferPurpose"
                  rows="3"
                  onChange={handleInput}
                  value={transferRequest.accountTransferPurpose}
                  placeholder="Reason for transfer..."
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>

              <div className="d-flex align-items-center justify-content-center mt-3">
                <button
                  type="submit"
                  className="btn"
                  onClick={saveAccount}
                  style={{
                    background:
                      "linear-gradient(90deg, #9c1348, #c2185b)",
                    color: "#ffffff",
                    fontWeight: "bold",
                    padding: "0.6rem 2.2rem",
                    borderRadius: "8px",
                  }}
                >
                  Transfer
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* UPDATED FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "14px 0",
          background:
            "linear-gradient(90deg, #070d2b, #1a144f)",
          color: "#e5e7eb",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p className="mb-1">
          © {new Date().getFullYear()}{" "}
          <b style={{ color: "#ffcc00" }}>
            Full Stack Java Developer
          </b>
          . All Rights Reserved.
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

export default CustomerAccountFundTransfer;
