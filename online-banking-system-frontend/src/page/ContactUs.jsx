import { FcCellPhone } from "react-icons/fc";
import { GiRotaryPhone } from "react-icons/gi";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ContactUs = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4a300 0%, #ffcc4d 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* McD Soft Background Illustration */}
      <img
        src="/images/mcd-bg.png"
        alt=""
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "540px",
          opacity: 0.08,
        }}
      />

      <div className="container flex-grow-1 py-5">

        {/* Header */}
        <div className="text-center mb-5">
          <h1
            className="fw-bold"
            style={{
              fontSize: "3rem",
              color: "#c30000",
              textShadow: "0 0 10px rgba(255,190,0,0.4)",
            }}
          >
            Contact Us
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#4c2a00" }}>
            We're here to help! Reach out for inquiries, collaborations, or support.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="row g-4">

         

          {/* Contact */}
          <div className="col-lg-6 col-md-12">
            <div className="contact-card">
              <h5 className="section-title">Contact</h5>

              <p className="contact-text">
                <FcCellPhone /> <b>Mobile:</b>{" "}
                <a  className="contact-highlight">
                  1234567890
                </a>{" "}
                /{" "}
                <a  className="contact-highlight">
                  +91 9876543210
                </a>
              </p>

              <p className="contact-text">
                <GiRotaryPhone /> <b>Office:</b>{" "}
                <a  className="contact-highlight">
                  022-12345678
                </a>
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="col-lg-6 col-md-12">
            <div className="contact-card">
              <h5 className="section-title">Email</h5>
              <p>
                <a
                  href="mailto:tushargalande037@gmail.com"
                  className="contact-highlight fw-bold"
                >
                  tushargalande037@gmail.com
                </a>
              </p>
            </div>
          </div>

          

        </div>

        {/* Footer Note */}
        <div className="text-center mt-5">
          <p style={{ fontSize: "1.2rem", color: "#4c2a00" }}>
            Feel free to reach out anytime — we are happy to assist you!
          </p>
        </div>

      </div>

      {/* Footer */}
      <footer
        className="py-4 text-center mt-auto"
        style={{
          width: "100%",
          background: "#d40000",
          color: "#ffe6a1",
          borderTop: "4px solid #ffc72c",
        }}
      >
        <p className="mb-1 fw-bold">
          © {new Date().getFullYear()} Full Stack Java Developer. All Rights Reserved.
        </p>

        <small className="fw-bold">
          Designed with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/tushar-galande-ab3648292/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffc72c", textDecoration: "none" }}
          >
            Tushar Galande
          </a>
        </small>
      </footer>

      {/* Professional McDonald's Theme CSS */}
      <style>{`
        .contact-card {
          background: #fff5d6;
          border-radius: 18px;
          padding: 28px;
          border: 2px solid #ffc72c;
          box-shadow: 0 8px 22px rgba(100, 50, 0, 0.25);
          transition: 0.3s ease;
        }

        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(100, 50, 0, 0.35);
        }

        .section-title {
          font-weight: bold;
          margin-bottom: 16px;
          color: #c30000;
          font-size: 1.3rem;
        }

        .contact-text {
          color: #4c2a00;
          margin-bottom: 8px;
        }

        .contact-highlight {
          color: #c30000;
          font-weight: bold;
          text-decoration: none;
        }

        .contact-highlight:hover {
          text-decoration: underline;
        }
      `}</style>

    </div>
  );
};

export default ContactUs;