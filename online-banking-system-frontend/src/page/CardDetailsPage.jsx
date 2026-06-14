import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const maskCardNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length < 12) return digits || "-";
  const last4 = digits.slice(-4);
  return `XXXX XXXX XXXX ${last4}`;
};

const normalizeCardNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 16) return digits || "-";
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 16)}`;
};

const getCvv = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 3) return "---";
  return digits;
};

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="M12 5C6 5 2.1 9.2 1 12c1.1 2.8 5 7 11 7s9.9-4.2 11-7c-1.1-2.8-5-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
      fill="currentColor"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="m3.3 2 18.7 18.7-1.4 1.4-3.1-3.1A12.8 12.8 0 0 1 12 20c-6 0-9.9-4.2-11-7a12.6 12.6 0 0 1 4.1-5.1L1.9 4.7 3.3 2zm8.7 6A4 4 0 0 0 8 12c0 .8.2 1.5.6 2.1l5.5 5.5c5.1-.9 8.3-4.6 9.1-6.6a13 13 0 0 0-4.5-5.2l-2.4-2.4A12.4 12.4 0 0 0 12 4c-1.3 0-2.5.2-3.7.7L12 8z"
      fill="currentColor"
    />
  </svg>
);

const CardDetailsPage = () => {
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

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCardIds, setVisibleCardIds] = useState([]);
  const [backVisibleCardIds, setBackVisibleCardIds] = useState([]);
  const [visibleCvvCardIds, setVisibleCvvCardIds] = useState([]);

  useEffect(() => {
    if (!customerId) {
      navigate("/user/login");
      return;
    }

    const fetchCards = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/issued-card/fetch/customer?customerId=${customerId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("customer-jwtToken"),
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.success) {
          setCards(data.cards || []);
          setError("");
        } else {
          setCards([]);
          setError(data.responseMessage || "Unable to load card details.");
        }
      } catch (err) {
        setError("Unable to connect to card service.");
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [customerId, navigate]);

  const toggleShowCardNumber = (id) => {
    setVisibleCardIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCardSide = (id) => {
    setBackVisibleCardIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleShowCvv = (id) => {
    setVisibleCvvCardIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Your Card Details</h3>
              <p className="mb-0 opacity-75">Cards are generated automatically after approval.</p>
            </div>

            <div className="card-body">
              {loading ? (
                <p>Loading card details...</p>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : cards.length === 0 ? (
                <div className="alert alert-info">
                  No cards issued yet. Please check your application status.
                </div>
              ) : (
                <div className="row g-3">
                  {cards.map((card) => (
                    <div className="col-md-6" key={card.id}>
                      <div
                        className="card border-0 shadow-sm"
                        style={{
                          borderRadius: "16px",
                          background: "linear-gradient(135deg, #0d1b3d, #8b0f3a)",
                          color: "white",
                        }}
                      >
                        <div className="card-body">
                          {backVisibleCardIds.includes(card.id) ? (
                            <>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="fw-semibold">Card Back</div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-light"
                                  onClick={() => toggleCardSide(card.id)}
                                >
                                  Show Front
                                </button>
                              </div>

                              <div
                                style={{
                                  height: "42px",
                                  background: "#111",
                                  borderRadius: "6px",
                                  marginTop: "8px",
                                }}
                              />

                              <div className="mt-3 d-flex justify-content-end align-items-center gap-2">
                                <div
                                  style={{
                                    background: "#ececec",
                                    color: "#111",
                                    borderRadius: "4px",
                                    padding: "6px 10px",
                                    minWidth: "120px",
                                    textAlign: "right",
                                    fontFamily: "monospace",
                                    letterSpacing: "1px",
                                  }}
                                >
                                  CVV {visibleCvvCardIds.includes(card.id) ? getCvv(card.cvv) : "***"}
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-light d-flex align-items-center gap-1"
                                  onClick={() => toggleShowCvv(card.id)}
                                  title={visibleCvvCardIds.includes(card.id) ? "Hide CVV" : "Show CVV"}
                                >
                                  {visibleCvvCardIds.includes(card.id) ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                              </div>

                              <div className="small mt-3 opacity-75">
                                Signature panel and security strip are shown on card back.
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="small opacity-75">Card Type</div>
                                  <div className="fw-bold">
                                    {String(card.cardType || "-").replaceAll("_", " ")}
                                  </div>
                                </div>
                                <span className="badge bg-light text-dark">{card.status || "-"}</span>
                              </div>

                              <div className="mt-3 d-flex align-items-center justify-content-between">
                                <div style={{ letterSpacing: "2px", fontSize: "1.1rem" }}>
                                  {visibleCardIds.includes(card.id)
                                    ? normalizeCardNumber(card.cardNumber)
                                    : maskCardNumber(card.cardNumber)}
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-light d-flex align-items-center gap-1"
                                  onClick={() => toggleShowCardNumber(card.id)}
                                  title={visibleCardIds.includes(card.id) ? "Hide card number" : "Show card number"}
                                >
                                  {visibleCardIds.includes(card.id) ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                              </div>

                              <div className="d-flex justify-content-between mt-3">
                                <div>
                                  <div className="small opacity-75">Expiry</div>
                                  <div className="fw-semibold">
                                    {card.expiryMonth || "--"}/{String(card.expiryYear || "").slice(-2) || "--"}
                                  </div>
                                </div>
                                <div className="text-end">
                                  <div className="small opacity-75">Issued By</div>
                                  <div className="fw-semibold">{card.bank?.name || "Bank"}</div>
                                </div>
                              </div>

                              <div className="d-flex justify-content-end mt-3">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-light"
                                  onClick={() => toggleCardSide(card.id)}
                                >
                                  Show Back
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;

