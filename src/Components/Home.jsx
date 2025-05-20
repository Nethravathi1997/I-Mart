import React from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";

export function Home() {
   const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Imart</h1>
          <p>Your one-stop shop for quality products with fast delivery, secure payment, and 24/7 support.</p>
          <button onClick={() => navigate("/products")}>Shop Now</button>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <img src="https://img.icons8.com/ios-filled/64/000000/truck.png" alt="Fast Delivery"/>
          <h3>Fast Delivery</h3>
          <p>Get your orders in record time with our speedy delivery network.</p>
        </div>
        <div className="feature">
          <img src="https://img.icons8.com/ios-filled/64/000000/lock.png" alt="Secure Payments"/>
          <h3>Secure Payments</h3>
          <p>We use encrypted payment gateways to keep your transactions safe.</p>
        </div>
        <div className="feature">
          <img src="https://img.icons8.com/ios-filled/64/000000/headset.png" alt="24/7 Support"/>
          <h3>24/7 Support</h3>
          <p>Our support team is available around the clock to assist you.</p>
        </div>
      </section>

      <section className="about">
        <h2>About Imart</h2>
        <p>At Imart, we aim to bring you the best products at great prices. Our mission is to make online shopping easy and enjoyable, backed by reliable service and a friendly team.</p>
      </section>

      <section className="cta">
        <h2>Ready to Explore Imart?</h2>
        <button onClick={() => navigate("/products")}>Get Started</button>
      </section>
    </div>
  );
}

