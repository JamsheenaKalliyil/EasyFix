import "./about.css";
import {
  FaBolt,
  FaShieldAlt,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

const About = () => {
  return (
    <>
      {/* Hero */}
      <div style={{ marginTop: "8%" }}>
        <section className="about-hero">
          <div className="hero-overlay">
            <h1>About EasyFix</h1>
            <p>Your Trusted Home Service Partner</p>
          </div>
        </section>

        {/* Who We Are */}

        <section className="about-container">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
              alt="EasyFix Team"
            />
          </div>

          <div className="about-content">
            <h2>Who We Are</h2>

            <p>
              EasyFix is an online home service platform that connects customers
              with trusted professionals for electrical work, plumbing,
              carpentry, painting, cleaning, appliance repair, and many other
              household services.
            </p>

            <p>
              Our goal is to make booking home services simple, affordable, and
              reliable. We believe everyone deserves quality workmanship from
              verified professionals.
            </p>
          </div>
        </section>

        {/* Mission */}

        <section className="mission-section">
          <div className="mission-card">
            <FaBolt className="mission-icon" />

            <h3>Our Mission</h3>

            <p>
              To provide fast, affordable and professional home services with
              complete customer satisfaction.
            </p>
          </div>

          <div className="mission-card">
            <FaShieldAlt className="mission-icon" />

            <h3>Our Vision</h3>

            <p>
              To become the most trusted home service platform by delivering
              quality and reliability.
            </p>
          </div>
        </section>

        {/* Services */}

        <section className="services-section">
          <h2>Services We Offer</h2>

          <div className="service-grid">
            <div className="service-box">⚡ Electrical Services</div>

            <div className="service-box">🚰 Plumbing</div>

            <div className="service-box">🪚 Carpentry</div>

            <div className="service-box">🎨 Painting</div>

            <div className="service-box">🧹 Home Cleaning</div>

            <div className="service-box">❄ AC Repair</div>
          </div>
        </section>

        {/* Why Choose */}

        <section className="why-section">
          <h2>Why Choose EasyFix?</h2>

          <div className="why-grid">
            <div className="why-card">
              <FaUsers className="why-icon" />

              <h4>Verified Experts</h4>

              <p>Experienced and trusted professionals.</p>
            </div>

            <div className="why-card">
              <FaClock className="why-icon" />

              <h4>Quick Booking</h4>

              <p>Book your preferred service within minutes.</p>
            </div>

            <div className="why-card">
              <FaCheckCircle className="why-icon" />

              <h4>Quality Work</h4>

              <p>Reliable service with customer satisfaction.</p>
            </div>

            <div className="why-card">
              <FaTools className="why-icon" />

              <h4>Professional Support</h4>

              <p>Dedicated support before and after every service.</p>
            </div>
          </div>
        </section>

        {/* Values */}

        <section className="values-section">
          <h2>Our Core Values</h2>

          <div className="values-grid">
            <div>✔ Integrity</div>

            <div>✔ Reliability</div>

            <div>✔ Professionalism</div>

            <div>✔ Customer First</div>
          </div>
        </section>

        {/* CTA */}

        <section className="about-cta">
          <h2>Need Professional Home Services?</h2>

          <p>
            EasyFix is always ready to help you with trusted and affordable home
            maintenance services.
          </p>

          <button>Book a Service</button>
        </section>
      </div>
    </>
  );
};

export default About;
