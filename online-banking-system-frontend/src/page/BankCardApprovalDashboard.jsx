import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BankCardApprovalDashboard = () => {
  const navigate = useNavigate();

  const bankRaw = sessionStorage.getItem("active-bank");
  const bank = useMemo(() => {
    try {
      return bankRaw ? JSON.parse(bankRaw) : null;
    } catch (e) {
      return null;
    }
  }, [bankRaw]);

  const bankId = bank?.bank?.id || bank?.id;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCardApplications = async () => {
    if (!bankId) {
      setError("Bank session is missing or invalid. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `http://localhost:8080/api/card/fetch/bank?bankId=${bankId}&status=PENDING`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("bank-jwtToken"),
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.success) {
        setApplications(data.applications || []);
        setError("");
      } else {
        setApplications([]);
        setError(data.responseMessage || "Unable to load card applications.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timeout. Server is not responding.");
      } else {
        setError("Unable to connect to the card service. Ensure backend is running on port 8080.");
      }
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bankId) {
      setError("Bank login required. Redirecting to login...");
      setLoading(false);
      navigate("/user/login");
      return;
    }

    fetchCardApplications();
  }, [bankId, navigate]);

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/card/update/status?applicationId=${applicationId}&status=${encodeURIComponent(
          status
        )}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("bank-jwtToken"),
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(`Application ${status.toLowerCase()} successfully.`, {
          position: "top-center",
          autoClose: 1200,
        });
        fetchCardApplications();
        return;
      }

      toast.error(data.responseMessage || "Could not update status.", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (err) {
      toast.error("Unable to connect to approval service.", {
        position: "top-center",
        autoClose: 1500,
      });
    }
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
        <div className="col-12 col-xl-11">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h3 className="mb-0">Bank Card Approval Dashboard</h3>
              <p className="mb-0 opacity-75">Review pending card requests and approve/reject them.</p>
            </div>

            <div className="card-body">
              {loading ? (
                <p>Loading card requests...</p>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : applications.length === 0 ? (
                <div className="alert alert-info">No pending card applications found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Card Type</th>
                        <th>Age</th>
                        <th>CIBIL</th>
                        <th>Employment</th>
                        <th>Salary</th>
                        <th>Turnover</th>
                        <th>Docs</th>
                        <th>Applied On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, index) => (
                        <tr key={app.id || index}>
                          <td>{index + 1}</td>
                          <td>{app.customer?.name || "-"}</td>
                          <td>{safe(app.cardType)?.replaceAll("_", " ")}</td>
                          <td>{safe(app.age)}</td>
                          <td>{safe(app.cibilScore)}</td>
                          <td>{safe(app.employmentType || app.employmentStatus)}</td>
                          <td>{safe(app.monthlySalary)}</td>
                          <td>{safe(app.annualTurnover)}</td>
                          <td>
                            <div className="small">
                              Aadhaar: {safe(app.hasAadhaar)}
                              <br />
                              PAN: {safe(app.hasPan)}
                              <br />
                              Bank Stmt: {safe(app.hasBankStatement)}
                            </div>
                          </td>
                          <td>{formatDate(app.createdAt)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => updateStatus(app.id, "APPROVED")}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => updateStatus(app.id, "REJECTED")}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
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
      <ToastContainer />
    </div>
  );
};

export default BankCardApprovalDashboard;

