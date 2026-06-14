import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoanApplicationPage = () => {
  const navigate = useNavigate();

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const bank = JSON.parse(sessionStorage.getItem("active-bank"));

  const [loanApplication, setLoanApplication] = useState({
    loanType: "",
    amount: 50000,
    term: "",
    purpose: "",
    monthlyIncome: "",
    employmentStatus: "",
    interestRate: "",
    emi: "",
    totalAmount: "",
    totalInterest: "",
    customerId: "",
    bankId: "",
  });

  const [checkingAuth, setCheckingAuth] = useState(true);

  // ========================= INTEREST DATA =========================

  const loanRateRanges = {
    HOME_LOAN: {
      "5": [
        { min: 0, max: 1000000, rate: 8.5 },
        { min: 1000000, max: 5000000, rate: 8.0 },
        { min: 5000000, max: 10000000, rate: 7.8 },
        { min: 10000000, max: Infinity, rate: 7.5 },
      ],
      "10": [
        { min: 0, max: 1000000, rate: 8.7 },
        { min: 1000000, max: 5000000, rate: 8.2 },
        { min: 5000000, max: 10000000, rate: 8.0 },
        { min: 10000000, max: Infinity, rate: 7.7 },
      ],
      "20": [
        { min: 0, max: 1000000, rate: 8.9 },
        { min: 1000000, max: 5000000, rate: 8.4 },
        { min: 5000000, max: 10000000, rate: 8.2 },
        { min: 10000000, max: Infinity, rate: 7.9 },
      ],
      "30": [
        { min: 0, max: 1000000, rate: 9.1 },
        { min: 1000000, max: 5000000, rate: 8.6 },
        { min: 5000000, max: 10000000, rate: 8.4 },
        { min: 10000000, max: Infinity, rate: 8.1 },
      ],
    },

    PERSONAL_LOAN: {
      "1": [
        { min: 0, max: 100000, rate: 18 },
        { min: 100000, max: 500000, rate: 14 },
        { min: 500000, max: 2000000, rate: 12 },
        { min: 2000000, max: Infinity, rate: 10 },
      ],
      "3": [
        { min: 0, max: 100000, rate: 20 },
        { min: 100000, max: 500000, rate: 15 },
        { min: 500000, max: 2000000, rate: 13 },
        { min: 2000000, max: Infinity, rate: 11 },
      ],
      "5": [
        { min: 0, max: 100000, rate: 22 },
        { min: 100000, max: 500000, rate: 16 },
        { min: 500000, max: 2000000, rate: 14 },
        { min: 2000000, max: Infinity, rate: 12 },
      ],
      "7": [
        { min: 0, max: 100000, rate: 24 },
        { min: 100000, max: 500000, rate: 17 },
        { min: 500000, max: 2000000, rate: 15 },
        { min: 2000000, max: Infinity, rate: 13 },
      ],
    },

    CAR_LOAN: {
      "3": [
        { min: 0, max: 500000, rate: 10 },
        { min: 500000, max: 1500000, rate: 9 },
        { min: 1500000, max: Infinity, rate: 8.5 },
      ],
      "5": [
        { min: 0, max: 500000, rate: 11 },
        { min: 500000, max: 1500000, rate: 10 },
        { min: 1500000, max: Infinity, rate: 9 },
      ],
      "7": [
        { min: 0, max: 500000, rate: 12 },
        { min: 500000, max: 1500000, rate: 11 },
        { min: 1500000, max: Infinity, rate: 10 },
      ],
    },

    EDUCATION_LOAN: {
      "5": [
        { min: 0, max: 400000, rate: 9 },
        { min: 400000, max: 2000000, rate: 10 },
        { min: 2000000, max: Infinity, rate: 11 },
      ],
      "10": [
        { min: 0, max: 400000, rate: 10 },
        { min: 400000, max: 2000000, rate: 11 },
        { min: 2000000, max: Infinity, rate: 12 },
      ],
    },

    GOLD_LOAN: {
      "0.25": [{ min: 0, max: Infinity, rate: 8 }],
      "0.5": [{ min: 0, max: Infinity, rate: 9 }],
      "1": [{ min: 0, max: Infinity, rate: 10 }],
      "2": [{ min: 0, max: Infinity, rate: 11 }],
    },
  };

  // ========================= TERM OPTIONS =========================

  const termOptionsByLoanType = {
    HOME_LOAN: [
      { value: "5", label: "5 Years" },
      { value: "10", label: "10 Years" },
      { value: "20", label: "20 Years" },
      { value: "30", label: "30 Years" },
    ],

    PERSONAL_LOAN: [
      { value: "1", label: "1 Year" },
      { value: "3", label: "3 Years" },
      { value: "5", label: "5 Years" },
      { value: "7", label: "7 Years" },
    ],

    CAR_LOAN: [
      { value: "3", label: "3 Years" },
      { value: "5", label: "5 Years" },
      { value: "7", label: "7 Years" },
    ],

    EDUCATION_LOAN: [
      { value: "5", label: "5 Years" },
      { value: "10", label: "10 Years" },
    ],

    GOLD_LOAN: [
      { value: "0.25", label: "3 Months" },
      { value: "0.5", label: "6 Months" },
      { value: "1", label: "12 Months" },
      { value: "2", label: "24 Months" },
    ],
  };

  // ========================= GET INTEREST RATE =========================

  const getInterestRate = (loanType, term, amount) => {
    if (!loanType || !term || !amount) return "";

    const amountNum = Number(amount);

    const ranges = loanRateRanges[loanType]?.[term];

    if (!ranges) return "";

    const matchedRange = ranges.find(
      (range) => amountNum > range.min && amountNum <= range.max
    );

    return matchedRange ? `${matchedRange.rate}%` : "";
  };

  // ========================= EMI CALCULATION =========================

  const calculateEMI = (principal, rateString, term) => {
    if (!principal || !rateString || !term) {
      return {
        emi: "",
        total: "",
        totalInterest: "",
      };
    }

    const annualRate = parseFloat(rateString.replace("%", ""));

    const monthlyRate = annualRate / 12 / 100;

    const months = parseFloat(term) * 12;

    const emi =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount = emi * months;

    const totalInterest = totalAmount - principal;

    return {
      emi: Math.round(emi),
      total: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
    };
  };

  // ========================= AUTH =========================

  useEffect(() => {
    if (!customer) {
      navigate("/user/login");
      return;
    }

    setLoanApplication((prev) => ({
      ...prev,
      customerId: customer.id,
      bankId: bank ? bank.bank.id : "",
    }));

    setCheckingAuth(false);
  }, [customer, bank, navigate]);

  // ========================= AUTO CALCULATION =========================

  useEffect(() => {
    const interestRate = getInterestRate(
      loanApplication.loanType,
      loanApplication.term,
      loanApplication.amount
    );

    const { emi, total, totalInterest } = calculateEMI(
      parseFloat(loanApplication.amount),
      interestRate,
      loanApplication.term
    );

    setLoanApplication((prev) => ({
      ...prev,
      interestRate,
      emi,
      totalAmount: total,
      totalInterest,
    }));
  }, [
    loanApplication.loanType,
    loanApplication.term,
    loanApplication.amount,
  ]);

  // ========================= INPUT =========================

  const handleInput = (e) => {
    const { name, value } = e.target;

    setLoanApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================= APPLY =========================

  const applyForLoan = async (e) => {
    e.preventDefault();

    if (
      loanApplication.loanType === "" ||
      loanApplication.amount === "" ||
      loanApplication.term === "" ||
      loanApplication.purpose === "" ||
      loanApplication.monthlyIncome === "" ||
      loanApplication.employmentStatus === ""
    ) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    const requestBody = {
      loanType: loanApplication.loanType,
      amount: Number(loanApplication.amount),
      term: loanApplication.term,
      purpose: loanApplication.purpose,
      monthlyIncome: loanApplication.monthlyIncome,
      employmentStatus: loanApplication.employmentStatus,
      interestRate: loanApplication.interestRate,
      emi: Number(loanApplication.emi),
      totalAmount: Number(loanApplication.totalAmount),
      totalInterest: Number(loanApplication.totalInterest),
      customerId: loanApplication.customerId,
      bankId: loanApplication.bankId || 0,
    };

    try {
      const response = await fetch("http://localhost:8080/api/loan/apply", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("customer-jwtToken"),
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(
          `Loan application submitted. EMI: ₹${loanApplication.emi.toLocaleString()}`
        );
        setTimeout(() => {
          navigate("/home");
        }, 2000);
        return;
      }

      toast.error(result.responseMessage || "Could not submit loan application");
    } catch (error) {
      console.error("Loan submission failed", error);
      toast.error("Loan submission failed. Please try again.");
    }
  };

  if (checkingAuth) return null;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">

          <div
            className="card shadow-lg"
            style={{
              marginTop: "40px",
              borderRadius: "15px",
            }}
          >
            <div
              className="card-header text-center"
              style={{
                background: "#0d1b3d",
                color: "white",
              }}
            >
              <h3>Loan Application</h3>
            </div>

            <div className="card-body">

              <form onSubmit={applyForLoan}>

                {/* Loan Type */}

                <div className="mb-3">
                  <label className="form-label">
                    Loan Type
                  </label>

                  <select
                    name="loanType"
                    value={loanApplication.loanType}
                    onChange={handleInput}
                    className="form-control"
                  >
                    <option value="">Select Loan</option>

                    <option value="HOME_LOAN">
                      Home Loan
                    </option>

                    <option value="PERSONAL_LOAN">
                      Personal Loan
                    </option>

                    <option value="CAR_LOAN">
                      Car Loan
                    </option>

                    <option value="EDUCATION_LOAN">
                      Education Loan
                    </option>

                    <option value="GOLD_LOAN">
                      Gold Loan
                    </option>
                  </select>
                </div>

                {/* Amount Slider */}

                <div className="mb-3">
                  <label className="form-label">
                    Loan Amount
                  </label>

                  <input
                    type="range"
                    min="50000"
                    max="20000000"
                    step="50000"
                    name="amount"
                    value={loanApplication.amount}
                    onChange={handleInput}
                    className="form-range"
                  />

                  <input
                    type="number"
                    name="amount"
                    value={loanApplication.amount}
                    onChange={handleInput}
                    className="form-control mt-2"
                  />
                </div>

                {/* Term */}

                <div className="mb-3">
                  <label className="form-label">
                    Loan Term
                  </label>

                  <select
                    name="term"
                    value={loanApplication.term}
                    onChange={handleInput}
                    className="form-control"
                  >
                    <option value="">
                      Select Term
                    </option>

                    {(termOptionsByLoanType[
                      loanApplication.loanType
                    ] || []).map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interest */}

                <div className="mb-3">
                  <label className="form-label">
                    Interest Rate
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={loanApplication.interestRate}
                    className="form-control"
                  />
                </div>

                {/* EMI */}

                <div className="mb-3">
                  <label className="form-label">
                    Monthly EMI
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={
                      loanApplication.emi
                        ? `₹${loanApplication.emi.toLocaleString()}`
                        : ""
                    }
                    className="form-control"
                  />
                </div>

                {/* Total Amount */}

                <div className="mb-3">
                  <label className="form-label">
                    Total Amount Payable
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={
                      loanApplication.totalAmount
                        ? `₹${loanApplication.totalAmount.toLocaleString()}`
                        : ""
                    }
                    className="form-control"
                  />
                </div>

                {/* Interest Payable */}

                <div className="mb-3">
                  <label className="form-label">
                    Total Interest
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={
                      loanApplication.totalInterest
                        ? `₹${loanApplication.totalInterest.toLocaleString()}`
                        : ""
                    }
                    className="form-control"
                  />
                </div>

                {/* Purpose */}

                <div className="mb-3">
                  <label className="form-label">
                    Purpose
                  </label>

                  <textarea
                    name="purpose"
                    value={loanApplication.purpose}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

                {/* Income */}

                <div className="mb-3">
                  <label className="form-label">
                    Monthly Income
                  </label>

                  <input
                    type="number"
                    name="monthlyIncome"
                    value={loanApplication.monthlyIncome}
                    onChange={handleInput}
                    className="form-control"
                  />
                </div>

                {/* Employment */}

                <div className="mb-3">
                  <label className="form-label">
                    Employment Status
                  </label>

                  <select
                    name="employmentStatus"
                    value={loanApplication.employmentStatus}
                    onChange={handleInput}
                    className="form-control"
                  >
                    <option value="">
                      Select Status
                    </option>

                    <option value="EMPLOYED">
                      Employed
                    </option>

                    <option value="SELF_EMPLOYED">
                      Self Employed
                    </option>

                    <option value="UNEMPLOYED">
                      Unemployed
                    </option>
                  </select>
                </div>

                {/* Buttons */}

                <div className="d-flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Apply Loan
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary w-100"
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

export default LoanApplicationPage;