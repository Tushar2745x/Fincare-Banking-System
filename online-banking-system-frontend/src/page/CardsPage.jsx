import { Link } from "react-router-dom";

const CardsPage = () => {
  return (
    <div
      className="container-fluid py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f4f7fb, #e1edf7)",
        color: "#12233d",
      }}
    >
      <div className="container" style={{ maxWidth: "1100px" }}>
        <div className="text-center mb-5">
          <h1 style={{ fontWeight: 800, fontSize: "2.5rem" }}>Card Services</h1>
          <p style={{ maxWidth: "720px", margin: "0 auto", color: "#4d5d7a" }}>
            Choose a card that fits your lifestyle — from debit cards for everyday spending to premium credit cards with rewards.
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              title: "Debit Card",
              description:
                "A safe and easy way to pay directly from your account with worldwide acceptance.",
              benefits: ["No annual fee", "Instant issue", "ATM withdrawals"],
              applyType: "DEBIT_CARD",
            },
            {
              title: "Credit Card",
              description:
                "Build credit and earn rewards on dining, travel and online purchases.",
              benefits: ["Reward points", "Cashback offers", "Contactless payments"],
              applyType: "CREDIT_CARD",
            },
            {
              title: "Business Card",
              description:
                "Control company spending with reporting, purchase limits and expense tracking.",
              benefits: ["Employee cards", "Expense management", "Higher limits"],
              applyType: "BUSINESS_CARD",
            },
          ].map((card) => (
            <div className="col-md-4" key={card.title}>
              <div
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "1.6rem",
                  minHeight: "100%",
                  boxShadow: "0 14px 40px rgba(28, 58, 98, 0.12)",
                }}
              >
                <h3 style={{ marginBottom: "0.8rem", color: "#0d2145" }}>{card.title}</h3>
                <p style={{ color: "#556b85", marginBottom: "1.4rem" }}>{card.description}</p>
                <ul style={{ paddingLeft: "1.2rem", color: "#4d5d7a" }}>
                  {card.benefits.map((benefit) => (
                    <li key={benefit} style={{ marginBottom: "0.5rem" }}>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/card/apply?type=${encodeURIComponent(card.applyType)}`}
                  className="btn"
                  style={{
                    marginTop: "1.4rem",
                    backgroundColor: "#0d1b3d",
                    color: "white",
                    borderRadius: "10px",
                    padding: "0.75rem 1.4rem",
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                >
                  Get Card
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardsPage;
