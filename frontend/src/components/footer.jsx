// export default Footer;
import "./footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}

        <div className="footer-brand">
          <h2>EasyFix</h2>

          <p>
            EasyFix is your trusted home service platform for booking
            professional electricians, plumbers, carpenters, painters, cleaners
            and more. Reliable service at your doorstep.
          </p>

          <div className="footer-features">
            <span>
              <FaShieldAlt /> Verified Experts
            </span>

            <span>
              <FaClock /> On-Time Service
            </span>

            <span>
              <FaCheckCircle /> Secure Payment
            </span>
          </div>
        </div>

        {/* Services */}

        <div className="footer-column">
          <h3>Popular Services</h3>

          <Link to="/services">Electrical</Link>
          <Link to="/services">Plumbing</Link>
          <Link to="/services">Carpentry</Link>
          <Link to="/services">Painting</Link>
          <Link to="/services">Home Cleaning</Link>
          <Link to="/services">Appliance Repair</Link>
        </div>

        {/* Company */}

        <div className="footer-column">
          <h3>Company</h3>

          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Contact */}

        <div className="footer-column">
          <h3>Contact Us</h3>

          <p>
            <FaMapMarkerAlt /> Kerala, India
          </p>

          <p>
            <FaPhoneAlt /> +91 98765 43210
          </p>

          <p>
            <FaEnvelope /> support@easyfix.com
          </p>

          <div className="social-icons">
            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaXTwitter />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EasyFix. All Rights Reserved.</p>

        <p>Built with ❤️ for Better Home Services</p>
      </div>
    </footer>
  );
};

export default Footer;
