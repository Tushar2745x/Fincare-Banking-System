import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <>
      {/* ------------------ MAIN CONTAINER ------------------ */}
      <div
        className="container-fluid py-5 mac-dark-bg"
        style={{
          minHeight: "100vh",
          color: "#2d1508",
          position: "relative",
          overflow: "hidden",
          background: "#f4a300", // Mustard-yellow (from your food image)
        }}
      >
        {/* 🍔 Floating Food Animations */}
        <div className="food-floating"></div>

        {/* ------------------ CONTENT ------------------ */}
        <div className="container fade-in-up">

          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="fw-bold mac-title">About Us</h1>
            <p className="subtitle-text">
              Building modern, scalable and performance-driven software solutions
              with passion, precision and purpose.
            </p>
          </div>

          <div className="row g-4">

            {/* Team Intro */}
            <div className="col-12">
              <div className="p-4 shadow mac-card">
                <p>
                  I am Java Developers based in{" "}
                  <a>
                    Pune, Maharashtra
                  </a>
                  , focused on delivering <b>high-quality, enterprise-grade</b>
                  applications that combine clean architecture with seamless user experience.
                </p>

                <p>
                  Our learning, execution and technical direction are guided by{" "}
                  <a
                    href="https://www.linkedin.com/in/tushar-galande-ab3648292/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mac-link"
                  >
                    Mr. Tushar Galande
                  </a>
                  , a highly respected Director, Software Architect, Book Author and{" "}
                 
                  .
                </p>

                <p>
                  With hands-on experience across multiple industries and technologies,
                  our mission is simple — <b>transform complex challenges into elegant
                  digital solutions</b>.
                </p>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="col-12">
              <div className="p-4 shadow mac-card">
                <h5 className="mb-3 fw-bold mac-subtitle">Our Expertise</h5>

                <p>
                  <a>
                    Java Development
                  </a>
                </p>

                <ul className="list-unstyled">
                  <li className="mb-2">✔ Backend – Java, Spring Boot, Microservices, REST APIs</li>
                  <li className="mb-2">✔ Frontend – React JS, UI/UX Enhancements</li>
                  <li className="mb-2">✔ Databases – MySQL, PostgreSQL, MongoDB</li>
                  <li className="mb-2">✔ DevOps – Docker, Kubernetes, AWS, CI/CD Pipelines</li>
                  <li className="mb-2">
                    ✔ Domain Expertise – Finance, Healthcare, CRM, Ecommerce, Insurance,
                    HRM, Airline Reservation, Wallet/Payments, GST Billing, Credit Score Dashboard
                  </li>
                </ul>
              </div>
            </div>

            {/* Mission */}
            <div className="col-12">
              <div className="p-4 shadow mac-card">
                <p>
                  We believe in engineering software that lasts — solutions that are
                  secure, scalable, maintainable and crafted with excellence.
                </p>

                <p>
                  Whether it's building a microservice ecosystem or designing a refined
                  UI/UX experience, our approach remains rooted in innovation and efficiency.
                </p>

                <div className="text-center mt-3">
                  <Link to="/contact" className="btn shadow px-4 py-2 mac-btn">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ------------------ FOOTER ------------------ */}
      <footer
        className="py-4 text-center fade-in"
        style={{
          width: "100%",
          background: "#d40000", // McDonald's red
          color: "#ffe6a1",
          borderTop: "4px solid #ffc72c",
        }}
      >
        <p className="mb-1">
          © {new Date().getFullYear()} <b> Java Developer</b>. All Rights Reserved.
        </p>

        <small>
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

      {/* ------------------ FULL MCDONALD'S THEME CSS ------------------ */}
      <style>{`
/* ============================================================
   🍟 FULL-SCREEN McDONALD'S THEME + FLOATING FOOD ITEMS
============================================================ */

/* 🍔 Floating Food Icons (matching your provided image) */
.food-floating {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  background-image:
    url("https://em-content.zobj.net/thumbs/240/apple/354/hamburger_1f354.png"),
    url("https://em-content.zobj.net/thumbs/240/apple/354/french-fries_1f35f.png"),
    url("https://em-content.zobj.net/thumbs/240/apple/354/cup-with-straw_1f964.png");
  background-size: 110px;
  background-repeat: repeat;
  opacity: 0.25;
  animation: floatFood 38s linear infinite;
}

@keyframes floatFood {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-600px); }
}

/* Keep all content above the floating layers */
.mac-dark-bg * {
  position: relative;
  z-index: 5;
}

/* 🍔 McD Style Glass Cards */
.mac-card {
  background: rgba(255, 242, 207, 0.8); 
  backdrop-filter: blur(14px);
  border: 2px solid #ffc72c;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(58, 31, 15, 0.3); /* cola brown shadow */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mac-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(58, 31, 15, 0.45);
}

/* Links */
.mac-link {
  color: #d40000;
  font-weight: bold;
}
.mac-link:hover {
  color: #8b0000;
  text-shadow: 0 0 5px rgba(255, 231, 120, 0.7);
}

/* Buttons — McD Red & Yellow */
.mac-btn {
  background: linear-gradient(135deg, #d40000, #ffcc00);
  border-radius: 12px;
  color: #fff8dd;
  font-weight: bold;
  transition: 0.3s;
}
.mac-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 22px rgba(212, 0, 0, 0.5);
}

/* Headings */
.mac-title {
  color: #d40000;
  text-shadow: 0 0 15px rgba(255, 231, 120, 0.4);
}
.mac-subtitle {
  color: #8b0000;
  text-shadow: 0 0 10px rgba(255, 231, 120, 0.35);
}

/* Subtitle */
.subtitle-text {
  font-size: 1.1rem;
  color: #402008;
  opacity: 0.85;
}

/* Fade Animations */
.fade-in-up {
  animation: fadeUp 1s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 1.2s;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

`}</style>
    </>
  );
};

export default AboutUs;