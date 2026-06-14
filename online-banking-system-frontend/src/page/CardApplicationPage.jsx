import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CardApplicationPage = () => {
  const navigate = useNavigate();

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));

  const [cardApplication, setCardApplication] = useState({
    cardType: "",
    annualIncome: "",
    employmentStatus: "",
    customerId: "",
    bankId: "",
  });

  useEffect(() => {
    if (!customer) {
      navigate("/user/login");
      return;
    }
    setCardApplication({
      ...cardApplication,
      customerId: customer.id,
      bankId: bank ? bank.bank.id : "",
    });
  }, []);

  const handleInput = (e) => {
    setCardApplication({ ...cardApplication, [e.target.name]: e.target.value });
  };

  const applyForCard = (e) => {
    e.preventDefault();

    if (
      cardApplication.cardType === "" ||
      cardApplication.annualIncome === "" ||
      cardApplication.employmentStatus === ""
    ) {
      toast.error("Please fill all the mandatory fields", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    fetch("http://localhost:8080/api/card/apply", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("customer-jwtToken"),
      },
      body: JSON.stringify(cardApplication),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success("Card application submitted successfully! Pending bank approval.", {
              position: "top-center",
              autoClose: 3000,
            });
            setTimeout(() => {
              navigate("/home");
            }, 2000);
          } else {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });
          }
        });
      })
      .catch(() => {
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
      });
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div
            className="card shadow-lg"
            style={{
              marginTop: "50px",
              borderRadius: "15px",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            <div
              className="card-header text-center"
              style={{
                background: "linear-gradient(135deg, #0d1b3d, #8b0f3a)",
                color: "white",
                borderRadius: "15px 15px 0 0",
                padding: "20px",
              }}
            >
              <h4>Card Application</h4>
              <p>Apply for your credit/debit card today</p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={applyForCard}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Card Type</label>
                  <select
                    name="cardType"
                    onChange={handleInput}
                    className="form-control"
                    value={cardApplication.cardType}
                  >
                    <option value="">Select Card Type</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="BUSINESS_CARD">Business Card</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Annual Income (₹)</label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={cardApplication.annualIncome}
                    onChange={handleInput}
                    className="form-control"
                    placeholder="Enter your annual income"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Employment Status</label>
                  <select
                    name="employmentStatus"
                    onChange={handleInput}
                    className="form-control"
                    value={cardApplication.employmentStatus}
                  >
                    <option value="">Select Employment Status</option>
                    <option value="EMPLOYED">Employed</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="UNEMPLOYED">Unemployed</option>
                  </select>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button type="submit" className="btn btn-primary">
                    Apply for Card
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/home")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CardApplicationPage;