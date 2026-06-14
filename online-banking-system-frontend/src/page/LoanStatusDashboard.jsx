import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoanStatusDashboard = () => {
  const navigate = useNavigate();
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customer) {
      navigate("/user/login");
      return;
    }

    const fetchLoanApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/loan/fetch/customer?customerId=${customer.id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("customer-jwtToken"),
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setApplications(data.applications || []);
        } else {
          setError(data.responseMessage || "Failed to load loan applications.");
        }
      } catch (err) {
        setError("Unable to connect to loan service.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanApplications();
  }, [customer, navigate]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const timestamp = Number(value);
    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toLocaleString();
    }
    return value;
  };

  const renderStatusBadge = (status) => {
    const normalized = String(status || "PENDING").toUpperCase();
    const colors = {
      PENDING: "badge bg-warning text-dark",
      APPROVED: "badge bg-success",
      REJECTED: "badge bg-danger",
      CLOSED: "badge bg-secondary",
    };
    return <span className={colors[normalized] || "badge bg-info"}>{normalized}</span>;
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Loan Application Dashboard</h3>
              <p className="mb-0 opacity-75">
                Track your loan application status, EMI, total payable amount and approval history.
              </p>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading loan applications...</p>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : applications.length === 0 ? (
                <div className="alert alert-info">
                  No loan applications found. Apply for a new loan from the Loans page.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Loan Type</th>
                        <th>Amount</th>
                        <th>Term</th>
                        <th>Rate</th>
                        <th>EMI</th>
                        <th>Total Payable</th>
                        <th>Total Interest</th>
                        <th>Status</th>
                        <th>Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application, index) => (
                        <tr key={application.id || index}>
                          <td>{index + 1}</td>
                          <td>{application.loanType?.replace("_", " ") || "-"}</td>
                          <td>{formatCurrency(application.amount)}</td>
                          <td>{application.term || "-"}</td>
                          <td>{application.interestRate || "-"}</td>
                          <td>{formatCurrency(application.emi)}</td>
                          <td>{formatCurrency(application.totalAmount)}</td>
                          <td>{formatCurrency(application.totalInterest)}</td>
                          <td>{renderStatusBadge(application.status)}</td>
                          <td>{formatDate(application.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatusDashboard;
