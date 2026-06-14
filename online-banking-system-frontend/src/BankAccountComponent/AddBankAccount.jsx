import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AddBankAccount = () => {
  const location = useLocation();
  const customer = location.state;

  const bank_jwtToken = sessionStorage.getItem("bank-jwtToken");
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));

  let navigate = useNavigate();

  const [bankAccount, setBankAccount] = useState({
    name: "",
    number: "",
    ifscCode: "",
    type: "",
    bankId: bank.bank.id,
    userId: customer.id,
  });

  // Auto-generate Account Number and IFSC Code on component mount
  useEffect(() => {
    const generateAccountNumber = () => {
      // Generate a 12-digit account number
      const randomNumber = Math.floor(Math.random() * 1000000000000)
        .toString()
        .padStart(12, "0");
      return randomNumber;
    };

    const generateIFSCCode = () => {
      // Format: BANKCODE + 0 + 5-digit branch code
      const bankCode = bank.bank.code || "BANK";
      const branchCode = Math.floor(Math.random() * 99999)
        .toString()
        .padStart(5, "0");
      return `${bankCode}0${branchCode}`;
    };

    setBankAccount((prev) => ({
      ...prev,
      number: generateAccountNumber(),
      ifscCode: generateIFSCCode(),
    }));
  }, [bank.bank.code]);

  const handleInput = (e) => {
    setBankAccount({ ...bankAccount, [e.target.name]: e.target.value });
  };

  const saveAccount = (e) => {
    fetch("http://localhost:8080/api/bank/account/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + bank_jwtToken,
      },
      body: JSON.stringify(bankAccount),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          console.log(res);

          if (res.success) {
            console.log("Got the success response");

            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              navigate("/customer/bank/account/detail", { state: customer });
            }, 1000);
          } else {
            console.log("Didn't got success response");
            toast.error("It seems server is down", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
    e.preventDefault();
  };

  return (
    <div style={{ background: "#f6f7ff", minHeight: "100vh", padding: "30px" }}>
      <div className="d-flex justify-content-center">
        <div
          className="card shadow-lg border-0"
          style={{ width: "52rem", borderRadius: "18px" }}
        >
          {/* Header */}
          <div
            className="text-center py-3"
            style={{
              background: "linear-gradient(90deg, #4b0082, #6a1b9a, #ffcc00)",
              color: "#fff",
              borderTopLeftRadius: "18px",
              borderTopRightRadius: "18px",
            }}
          >
            <h4 className="mb-0 fw-bold">➕ Add Bank Account</h4>
          </div>

          {/* Body */}
          <div className="card-body p-4">
            <form className="row g-3 text-color">
              {/* Bank Info */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Bank Name</label>
                <input type="text" className="form-control" value={bank.bank.name} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Bank Code</label>
                <input type="text" className="form-control" value={bank.bank.code} readOnly />
              </div>

              {/* Customer Info */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Customer Name</label>
                <input type="text" className="form-control" value={customer.name} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Customer Email</label>
                <input type="text" className="form-control" value={customer.email} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Customer Contact</label>
                <input type="text" className="form-control" value={customer.contact} readOnly />
              </div>

              {/* Account Inputs */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={bankAccount.number}
                  readOnly
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">IFSC Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={bankAccount.ifscCode}
                  readOnly
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Account Type</label>
                <select
                  onChange={handleInput}
                  className="form-control"
                  name="type"
                >
                  <option value="0">Select Account Type</option>
                  <option value="Saving">Saving</option>
                  <option value="Current">Current</option>
                </select>
              </div>

              {/* Button */}
              <div className="col-12 text-center mt-4">
                <button
                  type="submit"
                  className="btn px-5"
                  onClick={saveAccount}
                  style={{
                    background: "linear-gradient(90deg, #6a1b9a, #ffcc00)",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "10px",
                  }}
                >
                  Add Account
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccount;
