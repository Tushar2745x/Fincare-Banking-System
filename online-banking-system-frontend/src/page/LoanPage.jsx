import { Link } from "react-router-dom";

const LoanPage = () => {
  return (
    <div
      className="container-fluid py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #dde7ef)",
        color: "#0f254f",
      }}
    >
      <div className="container" style={{ maxWidth: "1100px" }}>
        <div className="text-center mb-5">
          <h1 style={{ fontWeight: 800, fontSize: "2.5rem" }}>Loan Solutions</h1>
          <p style={{ maxWidth: "720px", margin: "0 auto", color: "#4b5875" }}>
            Explore our flexible loan products built for home buyers, business owners, and customers who need fast personal support.
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              title: "Home Loan",
              description:
                "Low-interest home loans with long-term repayment and support for property purchase.",
              
              term: "Up to 30 years",
            },
            {
              title: "Personal Loan",
              description:
                "Quick approval personal loans for education, travel, medical and other everyday needs.",
              
              term: "Up to 5 years",
            },
            {
              title: "Business Loan",
              description:
                "Working capital and growth financing for small and medium enterprises.",
                
              term: "Up to 10 years",
            },
          ].map((loan) => (
            <div className="col-md-4" key={loan.title}>
              <div
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "1.6rem",
                  minHeight: "100%",
                  boxShadow: "0 14px 40px rgba(28, 58, 98, 0.12)",
                }}
              >
                <h3 style={{ marginBottom: "0.8rem", color: "#0d2145" }}>{loan.title}</h3>
                <p style={{ color: "#556b85", marginBottom: "1.4rem" }}>{loan.description}</p>
                <p style={{ fontWeight: 700, color: "#0d2145" }}>Term: {loan.term}</p>
                <Link
                  to="/loan/apply"
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
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanPage;
