import { Link } from "react-router-dom";

const AccountsPage = () => {
  return (
    <div
      className="container-fluid py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8, #d9e8f5)",
        color: "#0f254f",
      }}
    >
      <div className="container" style={{ maxWidth: "1100px" }}>
        <div className="text-center mb-5">
          <h1 style={{ fontWeight: 800, fontSize: "2.5rem" }}>Account Types</h1>
          <p style={{ maxWidth: "720px", margin: "0 auto", color: "#4b5875" }}>
            Explore our diverse range of accounts designed for every financial need — from everyday savings to specialized business solutions.
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              title: "Savings Account",
              description:
                "Perfect for individuals who want to save money with competitive interest rates and easy access to funds.",
              features: ["Interest up to 7% p.a.", "No minimum balance", "24/7 access"],
              icon: "💰",
            },
            {
              title: "Current Account",
              description:
                "Designed for businesses and frequent traders with unlimited deposits and withdrawals.",
              features: ["Unlimited transactions", "Overdraft facility", "Dedicated support"],
              icon: "🏢",
            },
            {
              title: "Fixed Deposits",
              description:
                "Secure your savings with guaranteed returns over fixed time periods.",
              features: ["Rates up to 8.5% p.a.", "Safe & secure", "Flexible tenure"],
              icon: "🔒",
            },
            {
              title: "Salary Account",
              description:
                "Exclusive for salaried professionals with special benefits and zero balance requirement.",
              features: ["Zero balance", "No annual charges", "Salary credit benefits"],
              icon: "📊",
            },
          ].map((account) => (
            <div className="col-md-6 col-lg-3" key={account.title}>
              <div
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "1.8rem",
                  minHeight: "100%",
                  boxShadow: "0 14px 40px rgba(28, 58, 98, 0.12)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 50px rgba(28, 58, 98, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 40px rgba(28, 58, 98, 0.12)";
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  {account.icon}
                </div>
                <h3 style={{ marginBottom: "0.8rem", color: "#0d2145" }}>
                  {account.title}
                </h3>
                <p style={{ color: "#556b85", marginBottom: "1.4rem", fontSize: "0.95rem" }}>
                  {account.description}
                </p>
                <ul style={{ paddingLeft: 0, color: "#4d5d7a", marginBottom: "1.4rem" }}>
                  {account.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        listStyle: "none",
                        marginBottom: "0.6rem",
                        paddingLeft: "1.4rem",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "#0d1b3d",
                        }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/user/login"
                  className="btn"
                  style={{
                    backgroundColor: "#0d1b3d",
                    color: "white",
                    borderRadius: "10px",
                    padding: "0.75rem 1.4rem",
                    display: "inline-block",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#091331";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#0d1b3d";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Open Account
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div
          style={{
            marginTop: "4rem",
            background: "white",
            borderRadius: "18px",
            padding: "2rem",
            boxShadow: "0 14px 40px rgba(28, 58, 98, 0.12)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#0d2145" }}>
            Why Choose Our Accounts?
          </h2>
          <div className="row g-4">
            {[
              { title: "Secure", description: "Bank-grade encryption and fraud protection" },
              { title: "Convenient", description: "24/7 digital banking and mobile support" },
              { title: "Transparent", description: "No hidden charges or surprise fees" },
              { title: "Competitive", description: "Best-in-class interest rates and benefits" },
            ].map((benefit) => (
              <div className="col-md-6 col-lg-3" key={benefit.title}>
                <div style={{ textAlign: "center" }}>
                  <h5 style={{ color: "#0d1b3d", marginBottom: "0.8rem" }}>
                    {benefit.title}
                  </h5>
                  <p style={{ color: "#556b85" }}>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
