import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

const getAppKey = (id) => String(id);

const BankLoanApprovalDashboard = () => {
  const navigate = useNavigate();
  const bank = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("active-bank");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);
  const bankId = bank?.bank?.id || bank?.id;
  const [applications, setApplications] = useState([]);
  const [statusChanges, setStatusChanges] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLoanApplications = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/loan/fetch/bank?bankId=${bankId}&status=PENDING`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("bank-jwtToken"),
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const pendingApps = data.applications || [];
        setApplications(pendingApps);
        setStatusChanges(
          pendingApps.reduce((acc, app) => {
            acc[getAppKey(app.id)] = String(app.status || "PENDING").toUpperCase();
            return acc;
          }, {})
        );
      } else {
        setError(data.responseMessage || "Failed to load loan applications.");
      }
    } catch (err) {
      setError("Unable to connect to loan service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bankId) {
      navigate("/user/login");
      return;
    }

    fetchLoanApplications();
  }, [bankId, navigate]);

  const handleStatusChange = (applicationId, newStatus) => {
    const key = getAppKey(applicationId);
    setStatusChanges((prev) => ({
      ...prev,
      [key]: newStatus,
    }));
  };

  const getSelectedStatus = (application) => {
    const key = getAppKey(application.id);
    return statusChanges[key] || String(application.status || "PENDING").toUpperCase();
  };

  const saveLoanStatus = async (application) => {
    const applicationId = application.id;
    const key = getAppKey(applicationId);
    const selectedStatus = statusChanges[key];

    if (!selectedStatus) {
      toast.error("Please select a status.");
      return;
    }

    const currentStatus = String(application.status || "PENDING").toUpperCase();
    if (selectedStatus === currentStatus) {
      toast.info("Status is already set to " + selectedStatus + ".");
      return;
    }

    setSavingId(applicationId);
    try {
      const response = await fetch(
        `http://localhost:8080/api/loan/update/status?applicationId=${applicationId}&status=${encodeURIComponent(selectedStatus)}`,
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
        const message =
          selectedStatus === "APPROVED"
            ? "Loan approved and customer balance updated."
            : `Loan status updated to ${selectedStatus}.`;
        toast.success(message, {
          position: "top-center",
          autoClose: 1500,
        });

        setApplications((prev) => prev.filter((app) => app.id !== applicationId));
        setStatusChanges((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        return;
      }

      toast.error(data.responseMessage || "Could not update loan status.");
    } catch (err) {
      toast.error("Unable to connect to approval service.");
    } finally {
      setSavingId(null);
    }
  };

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
            <div className="card-header bg-dark text-white">
              <h3 className="mb-0">Bank Loan Approval Dashboard</h3>
              <p className="mb-0 opacity-75">
                Review pending loan requests and approve loans to credit the customer account.
              </p>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Loading loan requests...</p>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : applications.length === 0 ? (
                <div className="alert alert-info">
                  No pending loan applications found for your bank.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Loan Type</th>
                        <th>Amount</th>
                        <th>Purpose</th>
                        <th>Employment</th>
                        <th>Term</th>
                        <th>Rate</th>
                        <th>EMI</th>
                        <th>Total Payable</th>
                        <th>Total Interest</th>
                        <th>Status</th>
                        <th>Applied On</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application, index) => {
                        const selectedStatus = getSelectedStatus(application);
                        const isSaving = savingId === application.id;
                        const hasChanges =
                          selectedStatus !==
                          String(application.status || "PENDING").toUpperCase();

                        return (
                          <tr key={application.id || index}>
                            <td>{index + 1}</td>
                            <td>{application.customer?.name || "-"}</td>
                            <td>{application.loanType?.replace("_", " ") || "-"}</td>
                            <td>{formatCurrency(application.amount)}</td>
                            <td>{application.purpose || "-"}</td>
                            <td>{application.employmentStatus || "-"}</td>
                            <td>{application.term || "-"}</td>
                            <td>{application.interestRate || "-"}</td>
                            <td>{formatCurrency(application.emi)}</td>
                            <td>{formatCurrency(application.totalAmount)}</td>
                            <td>{formatCurrency(application.totalInterest)}</td>
                            <td>{renderStatusBadge(selectedStatus)}</td>
                            <td>{formatDate(application.createdAt)}</td>
                            <td>
                              <div className="d-flex gap-2 align-items-center">
                                <select
                                  className="form-select form-select-sm"
                                  value={selectedStatus}
                                  onChange={(e) =>
                                    handleStatusChange(application.id, e.target.value)
                                  }
                                  disabled={isSaving}
                                >
                                  {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="btn btn-sm btn-primary text-nowrap"
                                  onClick={() => saveLoanStatus(application)}
                                  disabled={isSaving || !hasChanges}
                                >
                                  {isSaving ? "Saving..." : "Save"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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

export default BankLoanApprovalDashboard;
