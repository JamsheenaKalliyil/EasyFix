// export default Home;

import "./home.css";
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaTools,
  FaPaintRoller,
  FaBroom,
  FaSnowflake,
  FaShieldAlt,
  FaClock,
  FaUserCheck,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaBold,
  FaHeadset,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { FaRegStar } from "react-icons/fa";
const Home = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/home-reviews`);

        setReviews(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      {/* ================= HERO CAROUSEL ================= */}
      <div style={{ marginTop: "8%" }}>
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
            ></button>

            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
            ></button>

            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
                className="d-block w-100 carousel-img"
                alt=""
              />

              <div className="carousel-caption">
                <h1>Professional Home Services</h1>

                <p>
                  Trusted electricians, plumbers, cleaners and technicians at
                  your doorstep.
                </p>

                <Link to="/services" className="btn btn-warning btn-lg">
                  Book Service
                </Link>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                className="d-block w-100 carousel-img"
                alt=""
              />

              <div className="carousel-caption">
                <h1>Experienced Professionals</h1>

                <p>Verified experts for every home service.</p>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
                className="d-block w-100 carousel-img"
                alt=""
              />

              <div className="carousel-caption">
                <h1>Fast & Reliable</h1>

                <p>Quality service at affordable prices.</p>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>

        {/* ================= POPULAR SERVICES ================= */}

        <section className="services-section container">
          <h2 className="section-title">Popular Services</h2>

          <p className="section-subtitle">
            Find trusted professionals for all your home service needs.
          </p>

          <div className="services-grid">
            <div className="service-card">
              <FaBolt className="service-icon" />

              <h5>Electrician</h5>

              <p>Wiring, switch replacement, fan installation and more.</p>

              <Link to="/service-details/6a54adca47c125444134b4d9">
                Explore <FaArrowRight />
              </Link>
            </div>

            <div className="service-card">
              <FaTools className="service-icon" />

              <h5>Plumbing</h5>

              <p>Leak repairs, pipe installation and bathroom fittings.</p>

              <Link to="/service-details/6a54abdd47c125444134b4d8">
                Explore <FaArrowRight />
              </Link>
            </div>

            <div className="service-card">
              <FaPaintRoller className="service-icon" />

              <h5>Painting</h5>

              <p>Interior and exterior painting by experts.</p>

              <Link to="/service-details/6a6cce77e5eea2bf659af51f">
                Explore <FaArrowRight />
              </Link>
            </div>

            <div className="service-card">
              <FaSnowflake className="service-icon" />

              <h5>AC Repair</h5>

              <p>Installation, gas refill and maintenance.</p>

              <Link to="/service-details/6a5ca60800bb06cb14409c28">
                Explore <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}

        <section className="why-section">
          <div className="container">
            <h2 className="section-title">Why Choose EasyFix?</h2>

            <div className="why-grid">
              <div className="why-card">
                <FaShieldAlt className="why-icon" />

                <h4>Verified Experts</h4>

                <p>
                  Every professional is background verified and experienced.
                </p>
              </div>
              <div className="why-card">
                <FaHeadset className="why-icon" />

                <h4>24/7 Customer Support</h4>

                <p>
                  Our dedicated support team is available to assist you with any
                  service-related queries.
                </p>
              </div>

              <div className="why-card">
                <FaClock className="why-icon" />

                <h4>On-Time Service</h4>

                <p>We respect your time with punctual appointments.</p>
              </div>

              <div className="why-card">
                <FaUserCheck className="why-icon" />

                <h4>Trusted Platform</h4>

                <p>Thousands of customers rely on EasyFix every day.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}

        <section className="steps-section container">
          <h2 className="section-title">How It Works</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>

              <h5>Select Service</h5>

              <p>Choose the service you need.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>

              <h5>Book Online</h5>

              <p>Select your preferred date and time.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>

              <h5>Professional Visits</h5>

              <p>Verified staff arrive at your doorstep.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>

              <h5>Enjoy Service</h5>

              <p>Fast, reliable and quality work.</p>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}

        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div>
                <h2>5000+</h2>
                <p>Happy Customers</p>
              </div>

              <div>
                <h2>120+</h2>
                <p>Professionals</p>
              </div>

              <div>
                <h2>25+</h2>
                <p>Services</p>
              </div>

              <div>
                <h2>4.9★</h2>
                <p>Customer Rating</p>
              </div>
            </div>
          </div>
        </section>

       

        <section className="container testimonial-section">
          <h2 className="section-title">What Our Customers Say</h2>

          <div className="testimonial-grid">
            {reviews.map((review) => (
              <div className="testimonial-card" key={review._id}>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= review.rating ? (
                      <FaStar key={star} />
                    ) : (
                      <FaRegStar key={star} />
                    ),
                  )}
                </div>

                <p>{review.review}</p>

                <h6>{review.user?.name}</h6>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="cta-section">
          <div className="container">
            <FaCheckCircle className="cta-icon" />

            <h2>Ready to Book a Service?</h2>

            <p>
              EasyFix connects you with trusted professionals for reliable home
              services.
            </p>

            <Link to="/services" className="btn btn-warning btn-lg mt-3">
              Book Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
