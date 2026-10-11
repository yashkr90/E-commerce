import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { recommendationAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function CartPage() {
  const { cart, updateItem, removeItem, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      recommendationAPI.getRecommendations(user.id)
        .then(r => setRecommendations(r.data?.slice(0, 4) || []))
        .catch(() => {});
    }
  }, [user]);

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="empty-state">
          <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Start shopping and add books to your cart.</p>
          <Link to="/catalogue" className="btn btn-primary mt-16">Browse Books</Link>
        </div>
        {recommendations.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Recommended for You</h2>
            <div className="products-grid">
              {recommendations.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  const total = cart.totalAmount || cart.items?.reduce((s, i) => s + i.product.price * i.quantity, 0) || 0;

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>Shopping Cart ({itemCount} items)</h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="card">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <img
                src={item.product.imageUrl || 'https://via.placeholder.com/80x100?text=Book'}
                alt={item.product.title}
              />
              <div className="cart-item-info">
                <Link to={`/products/${item.product.id}`} className="cart-item-title">
                  {item.product.title}
                </Link>
                <div className="cart-item-author">by {item.product.author}</div>
                <div style={{ color: '#ff6f00', fontWeight: 700, marginBottom: 8 }}>
                  ${item.product.price?.toFixed(2)}
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => {
                    if (item.quantity <= 1) removeItem(item.id);
                    else updateItem(item.id, item.quantity - 1);
                  }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                  <button className="btn btn-sm btn-danger" style={{ marginLeft: 12 }}
                    onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, minWidth: 70, textAlign: 'right' }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="order-summary">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          {cart.items.map(item => (
            <div key={item.id} className="summary-row">
              <span>{item.product.title.substring(0, 25)}... × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>
          {user?.giftPoints > 0 && (
            <p style={{ fontSize: 12, color: '#757575', marginTop: 8 }}>
              🎁 You have <strong>{user.giftPoints}</strong> gift points available at checkout
            </p>
          )}
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }}
            onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <Link to="/catalogue" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Recommended Based on Your Orders</h2>
          <div className="products-grid">
            {recommendations.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
