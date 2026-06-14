import Carousel from "./Carousel";
import { Link } from "react-router-dom";
import travel_1 from "../images/MM.jpg";
import travel_2 from "../images/net-banking.png";

const HomePage = () => {
  return (
    <div className="container-fluid p-0">

      {/* HERO SECTION */}
      <div className="hero-section text-white">
        <Carousel />

        <div className="container py-5 fade-in">
          <div className="row align-items-center">
            <div className="col-md-8 slide-left">
              <h1 className="fw-bold display-5 mb-3">
                Welcome to Online Banking
              </h1>

              <p className="lh-lg">
                Welcome to our next-generation Fintech Banking System — where advanced technology meets trusted financial services to deliver a truly seamless digital banking experience.
              </p>

              <p className="lh-lg">
                <strong>Secure, Real-Time Transactions</strong><br />
                Initiate payments and transfers with confidence, backed by enterprise-grade encryption and regulatory compliance.
              </p>

              <p className="lh-lg">
                <strong>Simplified Fund Operations</strong><br />
                Deposit funds with ease and withdraw instantly — anytime, anywhere — through a responsive and intuitive platform.
              </p>

              <Link to="/user/login" className="btn btn-warning btn-lg fw-bold px-4 mt-2 pulse">
                Get Started
              </Link>
            </div>

            <div className="col-md-4 text-center slide-right">
              <img
                src={travel_2}
                alt="Online Banking"
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="container py-5">
        <div className="row g-4 text-center">
          <div className="col-md-4 zoom-in">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold">🔒 Bank-Grade Security</h5>
                <p className="text-muted">
                  Enterprise-level encryption ensures every transaction is safe.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 zoom-in delay-1">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold">⚡ Instant Transfers</h5>
                <p className="text-muted">
                  Real-time fund movement without waiting or delays.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 zoom-in delay-2">
            <div className="card shadow border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold">📱 Access Anywhere</h5>
                <p className="text-muted">
                  Seamless banking across mobile, tablet, and desktop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND CONTENT SECTION */}
      <div className="bg-light py-5">
        <div className="container fade-in">
          <div className="row align-items-center">
            <div className="col-md-4 text-center slide-left">
              <img
                src={travel_1}
                alt="Secure Banking"
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>

            <div className="col-md-8 slide-right">
              <h1 className="fw-bold mb-3">
                Simplify Your Finances with Smart, Secure Banking
              </h1>

              <p className="text-muted lh-lg">
                Experience a new level of financial control with our streamlined online banking platform. Designed for ease of use and reliability, it enables you to manage transactions efficiently, deposit funds with confidence, and withdraw safely.
              </p>

              <p className="text-muted lh-lg">
                Our user-centric interface delivers a seamless and intuitive digital banking experience — giving you complete control over your finances, anytime and anywhere.
              </p>

              <Link to="/user/login" className="btn btn-primary btn-lg px-4">
                Start Banking Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* INLINE CSS (SAFE & WORKING) */}
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #0d6efd, #0a58ca);
        }

        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }

        .slide-left {
          animation: slideLeft 1s ease-in-out;
        }

        .slide-right {
          animation: slideRight 1s ease-in-out;
        }

        .zoom-in {
          animation: zoomIn 0.8s ease-in-out;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }

        .pulse {
          animation: pulse 1.5s infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

    </div>
  );
};

export default HomePage;
