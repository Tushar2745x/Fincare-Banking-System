import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const CardStatusDashboard = () => {
  const navigate = useNavigate();

  const customerRaw = sessionStorage.getItem("active-customer");
  const customer = useMemo(() => {
    try {
      return customerRaw ? JSON.parse(customerRaw) : null;
    } catch (e) {
      return null;
    }
  }, [customerRaw]);

  const customerId = customer?.customer?.id || customer?.id;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCardApplications = async () => {
    if (!customerId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/card/fetch/customer?customerId=${customerId}`,
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
        setError("");
      } else {
        setApplications([]);
        setError(data.responseMessage || "Failed to load card applications.");
      }
    } catch (err) {
      setError("Unable to connect to card service.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!customerId) {
      navigate("/user/login");
      return;
    }

    fetchCardApplications();
    const intervalId = setInterval(fetchCardApplications, 5000); // auto-refresh for status changes
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, navigate]);

  const renderStatusBadge = (status) => {
    const normalized = String(status || "PENDING").toUpperCase();
    const colors = {
      PENDING: "badge bg-warning text-dark",
      APPROVED: "badge bg-success",
      REJECTED: "badge bg-danger",
    };
    return <span className={colors[normalized] || "badge bg-info"}>{normalized}</span>;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const timestamp = Number(value);
    if (!Number.isNaN(timestamp)) return new Date(timestamp).toLocaleString();
    return value;
  };

  const safe = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Card Application Status</h3>
              <p className="mb-0 opacity-75">
                Track your debit/credit/business card application status (updates automatically).
              </p>
            </div>

            <div className="card-body">
              {loading ? (
                <p>Loading card applications...</p>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : applications.length === 0 ? (
                <div className="alert alert-info">No card applications found. Apply from the Cards page.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Card Type</th>
                        <th>Status</th>
                        <th>Applied On</th>
                        <th>Bank Statement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, index) => (
                        <tr key={app.id || index}>
                          <td>{index + 1}</td>
                          <td>{safe(app.cardType)?.replaceAll("_", " ")}</td>
                          <td>{renderStatusBadge(app.status)}</td>
                          <td>{formatDate(app.createdAt)}</td>
                          <td>{app.bankStatementPdfName ? app.bankStatementPdfName : "-"}</td>
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

export default CardStatusDashboard;

