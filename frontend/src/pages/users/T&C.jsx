import "./T&C.css";
import {
  FaFileContract,
  FaClipboardCheck,
  FaUserShield,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUndoAlt,
  FaTools,
  FaShieldAlt,
  FaStar,
  FaLock,
  FaBan,
  FaBalanceScale,
  FaSyncAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaBuilding,
} from "react-icons/fa";

const TermsConditions = () => {
  return (
    <div className="terms-page">
      <div className="terms-banner">
        <h1>Terms & Conditions</h1>
        <p>
          Please read these Terms & Conditions carefully before using EasyFix
          Home Services.
        </p>
      </div>

      <div className="terms-container">
        <div className="terms-card">
          <h2>
            <FaFileContract /> Welcome to EasyFix
          </h2>
          <p>
            Thank you for choosing EasyFix. By accessing or using our platform,
            you agree to comply with these Terms & Conditions. If you do not
            agree, please discontinue using our services.
          </p>
        </div>

        <div className="terms-card">
          <h2>
            <FaClipboardCheck /> Services
          </h2>
          <p>
            EasyFix provides home services including Electrical, Plumbing,
            Carpentry, Painting, AC Repair, Refrigerator Repair, Washing Machine
            Repair, TV Repair, Deep Cleaning, Maid Services, Babysitting, Taxi
            Services and more.
          </p>
        </div>

        <div className="terms-card">
          <h2>
            <FaUserShield /> User Account
          </h2>
          <ul>
            <li>Provide accurate personal information.</li>
            <li>Keep your login credentials secure.</li>
            <li>You are responsible for all activity under your account.</li>
          </ul>
        </div>

        <div className="terms-card">
          <h2>
            <FaCalendarCheck /> Booking Policy
          </h2>
          <ul>
            <li>Bookings are confirmed only after successful submission.</li>
            <li>Provide the correct address and contact number.</li>
            <li>Bookings depend on technician availability.</li>
          </ul>
        </div>

        <div className="terms-card">
          <h2>
            <FaMapMarkerAlt /> Service Availability
          </h2>
          <p>
            EasyFix currently provides services only in supported locations.
            Bookings outside serviceable areas may be declined.
          </p>
        </div>

        <div className="terms-card">
          <h2>
            <FaMoneyBillWave /> Payments
          </h2>
          <ul>
            <li>Payments are processed through secure payment gateways.</li>
            <li>Applicable taxes may be included.</li>
            <li>Customers must complete payment before receiving invoices.</li>
          </ul>
        </div>

        <div className="terms-card">
          <h2>
            <FaUndoAlt /> Cancellation & Rescheduling
          </h2>
          <ul>
            <li>Orders may be cancelled before service begins.</li>
            <li>Repeated cancellations may lead to account restrictions.</li>
            <li>Rescheduling depends on staff availability.</li>
          </ul>
        </div>

        <div className="terms-card">
          <h2>
            <FaTools /> Customer Responsibilities
          </h2>
          <ul>
            <li>Be available during the booked time.</li>
            <li>Provide a safe working environment.</li>
            <li>Treat technicians respectfully.</li>
          </ul>
        </div>

        <div className="terms-card">
          <h2>
            <FaShieldAlt /> Warranty
          </h2>
          <p>
            Selected services may include a limited warranty depending on the
            type of work performed. Warranty does not cover misuse or accidental
            damage after service completion.
          </p>
        </div>

        <div className="terms-card">
          <h2>
            <FaStar /> Reviews & Ratings
          </h2>
          <p>
            Customers may submit honest reviews. Offensive, abusive, or false
            reviews may be removed by EasyFix.
          </p>
        </div>

        <div className="terms-card">
          <h2>
            <FaLock /> Privacy
          </h2>
          <p>
            Your personal information is collected only for booking services,
            customer support, payment processing, and improving our platform.
          </p>
        </div>

        <div className="terms-card">
          <h2>
            <FaBan /> Prohibited Activities
          </h2>
          <ul>
            <li>Fraudulent bookings.</li>
            <li>Abuse of technicians.</li>
            <li>Uploading malicious content.</li>
            <li>Attempting unauthorized access.</li>
          </ul>
        </div>

        <div className="terms-card">
          <h2>
            <FaBalanceScale /> Limitation of Liability
          </h2>
          <p>
            EasyFix acts as a service platform and shall not be liable for
            indirect losses, delays caused by unforeseen events, or damages
            arising from customer negligence.
          </p>
        </div>

        <div className="terms-card">
          <h2>
            <FaSyncAlt /> Changes to Terms
          </h2>
          <p>
            EasyFix reserves the right to update these Terms & Conditions at any
            time. Continued use of the application constitutes acceptance of the
            revised terms.
          </p>
        </div>

        <div className="terms-contact">
          <h2>Contact Us</h2>

          <div className="contact-item">
            <FaPhoneAlt />
            <span>Customer Care: +91 98765 43210</span>
          </div>

          <div className="contact-item">
            <FaEnvelope />
            <span>support@easyfix.com</span>
          </div>

          <div className="contact-item">
            <FaGlobe />
            <span>www.easyfix.com</span>
          </div>

          <div className="contact-item">
            <FaClock />
            <span>Monday - Saturday | 9:00 AM - 7:00 PM</span>
          </div>

          <div className="contact-item">
            <FaBuilding />
            <span>EasyFix Home Services</span>
          </div>

          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>Kozhikode, Kerala - 673001, India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
