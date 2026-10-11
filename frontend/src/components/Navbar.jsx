import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/catalogue?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          📚 E-Bookstore
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search books, authors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>

        <div className="navbar-links">
          <Link to="/catalogue">Catalogue</Link>

          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              <Link to="/cart" className="cart-badge">
                🛒 Cart
                {itemCount > 0 && <span className="badge">{itemCount}</span>}
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                👋 {user.firstName}
              </span>
              <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 6 }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
