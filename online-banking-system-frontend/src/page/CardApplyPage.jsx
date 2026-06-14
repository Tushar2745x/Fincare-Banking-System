import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const CardApplyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const customerRaw = sessionStorage.getItem("active-customer");
  const bankRaw = sessionStorage.getItem("active-bank");

  const customer = useMemo(() => {
    try {
      return customerRaw ? JSON.parse(customerRaw) : null;
    } catch (e) {
      return null;
    }
  }, [customerRaw]);

  const bank = useMemo(() => {
    try {
      return bankRaw ? JSON.parse(bankRaw) : null;
    } catch (e) {
      return null;
    }
  }, [bankRaw]);

  const preselectedType = String(searchParams.get("type") || "").toUpperCase();
  const allowedTypes = ["DEBIT_CARD", "CREDIT_CARD", "BUSINESS_CARD"];
  const initialType = allowedTypes.includes(preselectedType) ? preselectedType : "";

  const [cardApplication, setCardApplication] = useState({
    cardType: initialType,
    // common
    age: "",
    mobileLinkedWithBank: "YES",
    hasBankAccount: "YES",
    accountType: "",
    hasAadhaar: "YES",
    aadhaarNumber: "",
    hasPan: "YES",
    panNumber: "",
    hasOtherId: "NO", // Passport / DL / VoterId

    // credit specific
    employmentType: "", // SALARIED / SELF_EMPLOYED
    monthlySalary: "",
    cibilScore: "",
    hasSalarySlips: "NO",
    hasBankStatement: "NO",
    hasItr: "NO",

    // business specific
    businessRole: "", // OWNER / DIRECTOR / PARTNER / SELF_EMPLOYED_PRO
    annualTurnover: "",
    hasGstCertificate: "NO",
    hasBusinessRegistration: "NO",
    hasAddressProof: "NO",

    // legacy (kept so backend continues to work if it expects these)
    annualIncome: "",
    employmentStatus: "",
    customerId: "",
    bankId: "",
  });

  const [bankStatementPdf, setBankStatementPdf] = useState(null); // { name, size, type, base64 } | null

  useEffect(() => {
    if (!customer) {
      navigate("/user/login");
      return;
    }

    const customerId = customer?.customer?.id || customer?.id || "";
    const bankId = bank?.bank?.id || bank?.id || "";

    setCardApplication((prev) => ({
      ...prev,
      cardType: prev.cardType || initialType,
      customerId,
      bankId,
    }));
  }, [bank, customer, initialType, navigate]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCardApplication((prev) => {
      // if user marks doc as not available, clear its number
      if (name === "hasAadhaar" && String(value).toUpperCase() !== "YES") {
        return { ...prev, hasAadhaar: value, aadhaarNumber: "" };
      }
      if (name === "hasPan" && String(value).toUpperCase() !== "YES") {
        return { ...prev, hasPan: value, panNumber: "" };
      }
      if (name === "hasBankStatement" && String(value).toUpperCase() !== "YES") {
        setBankStatementPdf(null);
        return { ...prev, hasBankStatement: value };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleBankStatementUpload = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setBankStatementPdf(null);
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please upload only PDF file for bank statement.", {
        position: "top-center",
        autoClose: 1600,
      });
      e.target.value = "";
      setBankStatementPdf(null);
      return;
    }

    // keep a sane size limit for base64 in JSON (adjust if needed)
    const maxBytes = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxBytes) {
      toast.error("PDF is too large. Please upload a file up to 2MB.", {
        position: "top-center",
        autoClose: 1800,
      });
      e.target.value = "";
      setBankStatementPdf(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      // data:application/pdf;base64,XXXX
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      setBankStatementPdf({
        name: file.name,
        size: file.size,
        type: file.type,
        base64,
      });
    };
    reader.onerror = () => {
      toast.error("Failed to read PDF. Please try again.", {
        position: "top-center",
        autoClose: 1600,
      });
      setBankStatementPdf(null);
    };
    reader.readAsDataURL(file);
  };

  const validateApplication = () => {
    const t = String(cardApplication.cardType || "").toUpperCase();
    const age = Number(cardApplication.age);
    const yes = (v) => String(v || "").toUpperCase() === "YES";
    const num = (v) => Number(String(v ?? "").trim());
    const digitsOnly = (v) => String(v || "").replace(/\D/g, "");

    if (!t) return "Please select Card Type.";
    if (!cardApplication.age || Number.isNaN(age)) return "Please enter a valid age.";

    // common requirements
    if (!yes(cardApplication.hasBankAccount)) return "You must have a bank account to apply.";
    if (!yes(cardApplication.mobileLinkedWithBank)) return "Mobile number must be linked with the bank account.";
    if (!yes(cardApplication.hasAadhaar)) return "Aadhaar card is required (KYC).";
    if (!yes(cardApplication.hasPan)) return "PAN card is required (KYC).";
    if (yes(cardApplication.hasAadhaar)) {
      const a = digitsOnly(cardApplication.aadhaarNumber);
      if (!a) return "Please enter Aadhaar number.";
      if (a.length !== 12) return "Aadhaar number must be 12 digits.";
    }
    if (yes(cardApplication.hasPan)) {
      const pan = String(cardApplication.panNumber || "").toUpperCase().trim();
      if (!pan) return "Please enter PAN number.";
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return "PAN number format is invalid (e.g. ABCDE1234F).";
    }

    if (t === "DEBIT_CARD") {
      // Debit: usually 18+, allow 10+ for minor/student
      if (age < 10) return "Minimum age for debit card is 10+ (minor/student) or 18+ usually.";
      if (!cardApplication.accountType) return "Please select your Account Type (Savings/Current).";
      return "";
    }

    if (t === "CREDIT_CARD") {
      if (age < 18) return "Minimum age for credit card is 18+ (often 18–21).";
      if (age > 65) return "Maximum age for credit card is usually around 60–65.";
      if (!cardApplication.employmentType) return "Please select Employment Type (Salaried / Self-employed).";

      const cibil = num(cardApplication.cibilScore);
      if (!cardApplication.cibilScore || Number.isNaN(cibil)) return "Please enter a valid CIBIL score.";
      if (cibil < 700) return "Credit card usually needs CIBIL 700+ (750+ preferred).";

      if (cardApplication.employmentType === "SALARIED") {
        const sal = num(cardApplication.monthlySalary);
        if (!cardApplication.monthlySalary || Number.isNaN(sal)) return "Please enter your monthly salary.";
        if (sal < 15000) return "Minimum monthly salary should be ₹15,000+ for basic credit cards.";
        if (!yes(cardApplication.hasSalarySlips)) return "Salary slips (last 3 months) are required.";
        if (!yes(cardApplication.hasBankStatement)) return "Bank statement is required.";
        if (yes(cardApplication.hasBankStatement) && !bankStatementPdf) return "Please upload bank statement PDF.";
        return "";
      }

      if (cardApplication.employmentType === "SELF_EMPLOYED") {
        if (!yes(cardApplication.hasItr)) return "ITR is required for self-employed credit card applicants.";
        if (!yes(cardApplication.hasBankStatement)) return "Bank statement is required.";
        if (yes(cardApplication.hasBankStatement) && !bankStatementPdf) return "Please upload bank statement PDF.";
        return "";
      }

      return "";
    }

    if (t === "BUSINESS_CARD") {
      if (age < 18) return "Minimum age for business card is 18+.";
      if (!cardApplication.businessRole) return "Please select your Business Role.";

      const turnover = num(cardApplication.annualTurnover);
      if (!cardApplication.annualTurnover || Number.isNaN(turnover)) return "Please enter your annual turnover.";
      if (turnover < 300000) return "Minimum annual turnover should be ₹3 lakh+ for small business cards.";

      const cibil = num(cardApplication.cibilScore);
      if (!cardApplication.cibilScore || Number.isNaN(cibil)) return "Please enter a valid credit score.";
      if (cibil < 700) return "Business card usually needs credit score 700+.";

      if (!yes(cardApplication.hasBusinessRegistration)) return "Business registration proof is required.";
      if (!yes(cardApplication.hasGstCertificate)) return "GST certificate is often required.";
      if (!yes(cardApplication.hasItr)) return "ITR is required.";
      if (!yes(cardApplication.hasBankStatement)) return "Bank statements are required.";
      if (yes(cardApplication.hasBankStatement) && !bankStatementPdf) return "Please upload bank statement PDF.";
      if (!yes(cardApplication.hasAddressProof)) return "Address proof is required.";
      return "";
    }

    return "Invalid card type selected.";
  };

  const applyForCard = async (e) => {
    e.preventDefault();

    const validationError = validateApplication();
    if (validationError) {
      toast.error(validationError, { position: "top-center", autoClose: 1600 });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/card/apply", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("customer-jwtToken"),
        },
        body: JSON.stringify({
          // send legacy fields for backend compatibility
          cardType: cardApplication.cardType,
          annualIncome:
            cardApplication.cardType === "CREDIT_CARD"
              ? ""
              : cardApplication.annualIncome,
          employmentStatus: cardApplication.employmentStatus,
          customerId: cardApplication.customerId,
          bankId: cardApplication.bankId,

          // additional criteria fields (backend can ignore if not supported)
          age: cardApplication.age,
          mobileLinkedWithBank: cardApplication.mobileLinkedWithBank,
          hasBankAccount: cardApplication.hasBankAccount,
          accountType: cardApplication.accountType,
          hasAadhaar: cardApplication.hasAadhaar,
          aadhaarNumber: cardApplication.aadhaarNumber,
          hasPan: cardApplication.hasPan,
          panNumber: cardApplication.panNumber,
          hasOtherId: cardApplication.hasOtherId,
          employmentType: cardApplication.employmentType,
          monthlySalary: cardApplication.monthlySalary,
          cibilScore: cardApplication.cibilScore,
          hasSalarySlips: cardApplication.hasSalarySlips,
          hasBankStatement: cardApplication.hasBankStatement,
          bankStatementPdfName: bankStatementPdf?.name || "",
          bankStatementPdfBase64: bankStatementPdf?.base64 || "",
          hasItr: cardApplication.hasItr,
          businessRole: cardApplication.businessRole,
          annualTurnover: cardApplication.annualTurnover,
          hasGstCertificate: cardApplication.hasGstCertificate,
          hasBusinessRegistration: cardApplication.hasBusinessRegistration,
          hasAddressProof: cardApplication.hasAddressProof,
        }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        toast.success("Card application submitted successfully! Pending bank approval.", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/home"), 1200);
        return;
      }

      toast.error(res.responseMessage || "Unable to submit card application.", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (err) {
      toast.error("It seems server is down", { position: "top-center", autoClose: 1500 });
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f4f7fb, #e1edf7)",
        color: "#12233d",
      }}
    >
      <div className="container" style={{ maxWidth: "720px" }}>
        <div className="text-center mb-4">
          <h1 style={{ fontWeight: 800, fontSize: "2.2rem" }}>Apply for a Card</h1>
          <p style={{ margin: "0 auto", color: "#4d5d7a" }}>
            Submit your details. Your request will be reviewed by the bank.
          </p>
        </div>

        <div
          className="card shadow-lg"
          style={{
            borderRadius: "18px",
            background: "white",
            boxShadow: "0 14px 40px rgba(28, 58, 98, 0.12)",
          }}
        >
          <div
            className="card-header text-white"
            style={{
              background: "linear-gradient(135deg, #0d1b3d, #8b0f3a)",
              borderRadius: "18px 18px 0 0",
              padding: "18px 20px",
            }}
          >
            <h4 className="mb-1">Card Application</h4>
            <div className="opacity-75">Debit / Credit / Business</div>
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
                <label className="form-label fw-semibold">Age</label>
                <input
                  type="number"
                  name="age"
                  value={cardApplication.age}
                  onChange={handleInput}
                  className="form-control"
                  placeholder="Enter your age"
                  min="1"
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Do you have a bank account?</label>
                  <select
                    name="hasBankAccount"
                    onChange={handleInput}
                    className="form-control"
                    value={cardApplication.hasBankAccount}
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Mobile linked with bank account?</label>
                  <select
                    name="mobileLinkedWithBank"
                    onChange={handleInput}
                    className="form-control"
                    value={cardApplication.mobileLinkedWithBank}
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Aadhaar</label>
                  <select
                    name="hasAadhaar"
                    onChange={handleInput}
                    className="form-control"
                    value={cardApplication.hasAadhaar}
                  >
                    <option value="YES">Available</option>
                    <option value="NO">Not available</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">PAN</label>
                  <select
                    name="hasPan"
                    onChange={handleInput}
                    className="form-control"
                    value={cardApplication.hasPan}
                  >
                    <option value="YES">Available</option>
                    <option value="NO">Not available</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Other ID (DL/Passport/Voter)</label>
                  <select
                    name="hasOtherId"
                    onChange={handleInput}
                    className="form-control"
                    value={cardApplication.hasOtherId}
                  >
                    <option value="YES">Available</option>
                    <option value="NO">Not available</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mt-1">
                {String(cardApplication.hasAadhaar || "").toUpperCase() === "YES" && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Aadhaar Number</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={cardApplication.aadhaarNumber}
                      onChange={handleInput}
                      className="form-control"
                      placeholder="12-digit Aadhaar number"
                      inputMode="numeric"
                      maxLength={14}
                    />
                  </div>
                )}
                {String(cardApplication.hasPan || "").toUpperCase() === "YES" && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={cardApplication.panNumber}
                      onChange={(e) => {
                        const next = String(e.target.value || "").toUpperCase();
                        setCardApplication((prev) => ({ ...prev, panNumber: next }));
                      }}
                      className="form-control"
                      placeholder="e.g. ABCDE1234F"
                      maxLength={10}
                      autoCapitalize="characters"
                    />
                  </div>
                )}
              </div>

              {String(cardApplication.cardType || "").toUpperCase() === "DEBIT_CARD" && (
                <div className="mt-3">
                  <div className="alert alert-info mb-3">
                    Debit Card: Linked to your bank account. No income / credit score required.
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Account Type</label>
                    <select
                      name="accountType"
                      onChange={handleInput}
                      className="form-control"
                      value={cardApplication.accountType}
                    >
                      <option value="">Select Account Type</option>
                      <option value="SAVINGS">Savings</option>
                      <option value="CURRENT">Current</option>
                    </select>
                  </div>
                </div>
              )}

              {String(cardApplication.cardType || "").toUpperCase() === "CREDIT_CARD" && (
                <div className="mt-3">
                  <div className="alert alert-warning mb-3">
                    Credit Card: Requires stable income and good credit score (CIBIL 700+).
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Employment Type</label>
                    <select
                      name="employmentType"
                      onChange={handleInput}
                      className="form-control"
                      value={cardApplication.employmentType}
                    >
                      <option value="">Select</option>
                      <option value="SALARIED">Salaried</option>
                      <option value="SELF_EMPLOYED">Self-employed</option>
                    </select>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">CIBIL Score</label>
                      <input
                        type="number"
                        name="cibilScore"
                        value={cardApplication.cibilScore}
                        onChange={handleInput}
                        className="form-control"
                        placeholder="e.g. 750"
                        min="0"
                        max="900"
                      />
                    </div>

                    {cardApplication.employmentType === "SALARIED" && (
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Monthly Salary (₹)</label>
                        <input
                          type="number"
                          name="monthlySalary"
                          value={cardApplication.monthlySalary}
                          onChange={handleInput}
                          className="form-control"
                          placeholder="e.g. 25000"
                          min="0"
                        />
                      </div>
                    )}
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Salary Slips (3 months)</label>
                      <select
                        name="hasSalarySlips"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.hasSalarySlips}
                      >
                        <option value="YES">Available</option>
                        <option value="NO">Not available</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Bank Statement</label>
                      <select
                        name="hasBankStatement"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.hasBankStatement}
                      >
                        <option value="YES">Available</option>
                        <option value="NO">Not available</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">ITR (Self-employed)</label>
                      <select
                        name="hasItr"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.hasItr}
                      >
                        <option value="YES">Available</option>
                        <option value="NO">Not available</option>
                      </select>
                    </div>
                  </div>

                  {String(cardApplication.hasBankStatement || "").toUpperCase() === "YES" && (
                    <div className="mt-2">
                      <label className="form-label fw-semibold">Upload Bank Statement (PDF)</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="form-control"
                        onChange={handleBankStatementUpload}
                      />
                      {bankStatementPdf?.name && (
                        <div className="small text-muted mt-1">
                          Selected: {bankStatementPdf.name} ({Math.round(bankStatementPdf.size / 1024)} KB)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {String(cardApplication.cardType || "").toUpperCase() === "BUSINESS_CARD" && (
                <div className="mt-3">
                  <div className="alert alert-warning mb-3">
                    Business Card: Requires business proof, GST (often), turnover ₹3 lakh+ and credit score 700+.
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Business Role</label>
                      <select
                        name="businessRole"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.businessRole}
                      >
                        <option value="">Select</option>
                        <option value="OWNER">Owner / Entrepreneur</option>
                        <option value="DIRECTOR">Company Director</option>
                        <option value="PARTNER">Partner</option>
                        <option value="SELF_EMPLOYED_PRO">Self-employed Professional</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Annual Turnover (₹)</label>
                      <input
                        type="number"
                        name="annualTurnover"
                        value={cardApplication.annualTurnover}
                        onChange={handleInput}
                        className="form-control"
                        placeholder="e.g. 500000"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Credit Score</label>
                      <input
                        type="number"
                        name="cibilScore"
                        value={cardApplication.cibilScore}
                        onChange={handleInput}
                        className="form-control"
                        placeholder="e.g. 750"
                        min="0"
                        max="900"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Bank Statement</label>
                      <select
                        name="hasBankStatement"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.hasBankStatement}
                      >
                        <option value="YES">Available</option>
                        <option value="NO">Not available</option>
                      </select>
                    </div>
                  </div>

                  {String(cardApplication.hasBankStatement || "").toUpperCase() === "YES" && (
                    <div className="mt-2">
                      <label className="form-label fw-semibold">Upload Bank Statement (PDF)</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="form-control"
                        onChange={handleBankStatementUpload}
                      />
                      {bankStatementPdf?.name && (
                        <div className="small text-muted mt-1">
                          Selected: {bankStatementPdf.name} ({Math.round(bankStatementPdf.size / 1024)} KB)
                        </div>
                      )}
                    </div>
                  )}

                  <div className="row g-3 mt-1">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">GST Certificate</label>
                      <select
                        name="hasGstCertificate"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.hasGstCertificate}
                      >
                        <option value="YES">Available</option>
                        <option value="NO">Not available</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Business Registration</label>
                      <select
                        name="hasBusinessRegistration"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.hasBusinessRegistration}
                      >
                        <option value="YES">Available</option>
                        <option value="NO">Not available</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Address Proof</label>
                      <select
                        name="hasAddressProof"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.hasAddressProof}
                      >
                        <option value="YES">Available</option>
                        <option value="NO">Not available</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">ITR</label>
                      <select
                        name="hasItr"
                        onChange={handleInput}
                        className="form-control"
                        value={cardApplication.hasItr}
                      >
                        <option value="YES">Available</option>
                        <option value="NO">Not available</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold">Annual Income (₹) (optional)</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={cardApplication.annualIncome}
                  onChange={handleInput}
                  className="form-control"
                  placeholder="Enter your annual income"
                  min="0"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Employment Status (optional)</label>
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
                  Apply
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/cards")}>
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CardApplyPage;

