import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bank-footer">
      <div className="container py-5">

        {/* TOP SECTION */}
        <div className="row fade-up">

          {/* BRAND */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h4 className="fw-bold text-warning mb-3">Finecare Banking</h4>
            <p className="footer-text">
              Experience secure, smart, and seamless digital banking.
              Manage transactions, deposits, loans, and cards with
              enterprise-grade security and ease.
            </p>
            <p className="footer-badge">🔒 ISO Certified • RBI Compliant</p>
          </div>

          {/* QUICK LINKS */}
          <div className="col-lg-2 col-md-6 mb-4 slide-delay-1">
            <h6 className="footer-title">Accounts</h6>
            <ul className="footer-links">
              <li><Link to="/about">Savings Account</Link></li>
              <li><Link to="/about">Current Account</Link></li>
              <li><Link to="/about">Fixed Deposits</Link></li>
              <li><Link to="/about">Salary Account</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 slide-delay-2">
            <h6 className="footer-title">Loans</h6>
            <ul className="footer-links">
              <li><Link to="/about">Home Loan</Link></li>
              <li><Link to="/about">Personal Loan</Link></li>
              <li><Link to="/about">Education Loan</Link></li>
              <li><Link to="/about">Business Loan</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 slide-delay-3">
            <h6 className="footer-title">Cards</h6>
            <ul className="footer-links">
              <li><Link to="/about">Debit Cards</Link></li>
              <li><Link to="/about">Credit Cards</Link></li>
              <li><Link to="/about">Virtual Cards</Link></li>
              <li><Link to="/about">Offers</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div className="col-lg-2 col-md-6 mb-4 slide-delay-4">
            <h6 className="footer-title">Need Funds?</h6>
            <p className="footer-text-sm">
              Get instant loan approvals with minimal documentation.
            </p>
            <Link to="/user/login">
              <button className="btn btn-warning btn-sm fw-bold pulse-btn">
                Apply Loan
              </button>
            </Link>
          </div>

        </div>

        {/* DIVIDER */}
        <hr className="gold-divider" />

        {/* BOTTOM COPYRIGHT (YOUR EXACT CONTENT) */}
        <div className="text-center fade-in">
          <p className="mb-1">
            © 2026 Finecare Banking. All Rights Reserved.
          </p>

          <p className="footer-sub">
            Designed with ❤️ by{" "}
            <a
              href="https://www.linkedin.com/in/tushar-galande-ab3648292/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tushar Galande
            </a>
          </p>
        </div>

      </div>

      {/* INLINE CSS – SAFE, NO LIBRARY */}
      <style>{`
        .bank-footer {
          background: linear-gradient(135deg, #0b1d3a, #091a2f);
          color: #e0e0e0;
        }

        .footer-title {
          color: #ffd700;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .footer-text {
          font-size: 14px;
          line-height: 1.7;
        }

        .footer-text-sm {
          font-size: 13px;
          opacity: 0.9;
        }

        .footer-badge {
          font-size: 12px;
          color: #90caf9;
          margin-top: 10px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 8px;
        }

        .footer-links a {
          color: #e0e0e0;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: #ffd700;
          padding-left: 6px;
        }

        .gold-divider {
          border-color: #ffd700;
          margin: 30px 0;
        }

        .footer-sub a {
          color: #ffd700;
          text-decoration: none;
          font-weight: 600;
        }

        /* ANIMATIONS */
        .fade-up {
          animation: fadeUp 1s ease-in-out;
        }

        .fade-in {
          animation: fadeIn 1.2s ease-in-out;
        }

        .slide-delay-1 { animation: slideIn 0.8s ease forwards; }
        .slide-delay-2 { animation: slideIn 1s ease forwards; }
        .slide-delay-3 { animation: slideIn 1.2s ease forwards; }
        .slide-delay-4 { animation: slideIn 1.4s ease forwards; }

        .pulse-btn {
          animation: pulse 1.5s infinite;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
