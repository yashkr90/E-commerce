import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>📚 E-Bookstore</h4>
          <p style={{ fontSize: 13 }}>Your one-stop destination for books of all genres. Browse, select, and get them delivered to your doorstep.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/catalogue">Catalogue</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/catalogue?categoryId=1">Fiction</Link></li>
            <li><Link to="/catalogue?categoryId=2">Non-Fiction</Link></li>
            <li><Link to="/catalogue?categoryId=3">Science & Technology</Link></li>
            <li><Link to="/catalogue?categoryId=4">Business</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Customer Service</h4>
          <ul>
            <li>📧 support@ebookstore.com</li>
            <li>📞 1-800-BOOKS-24</li>
            <li>🕐 Mon–Sat 9am–6pm</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} E-Bookstore. All rights reserved. | Built with IBM BOB — AI Specialist Capstone Project
      </div>
    </footer>
  );
}
