import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI } from '../api';
import { toast } from 'react-toastify';

const METHODS = [
  { key: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
  { key: 'DEBIT_CARD', label: 'Debit Card', icon: '🏧' },
  { key: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
  { key: 'GIFT_POINTS', label: 'Gift Points', icon: '🎁' },
];

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const [method, setMethod] = useState('CREDIT_CARD');
  const [card, setCard] = useState({ cardNumber: '', cardHolderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
  const [loading, setLoading] = useState(false);

  if (!state?.addressId) {
    navigate('/checkout');
    return null;
  }

  const { addressId, giftPointsToRedeem, totalAmount, cartItems } = state;

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Place order
      const orderRes = await orderAPI.placeOrder({
        userId: user.id,
        addressId,
        giftPointsToRedeem: giftPointsToRedeem || 0,
        items: cartItems.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      });
      const order = orderRes.data;

      // 2. Process payment
      const paymentRes = await paymentAPI.processPayment({
        orderId: order.id,
        method,
        amount: totalAmount,
        ...card,
      });

      await refreshCart();
      toast.success('Payment successful!');
      navigate('/confirmation', { state: { order, payment: paymentRes.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showCardForm = method === 'CREDIT_CARD' || method === 'DEBIT_CARD';
  const set = (f) => (e) => setCard({ ...card, [f]: e.target.value });

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Payment</h1>

      {/* Steps */}
      <div className="steps">
        <div className="step done">1. Cart</div>
        <div className="step done">2. Delivery Address</div>
        <div className="step active">3. Payment</div>
        <div className="step">4. Confirmation</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>
        <div className="card card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Select Payment Method</h3>

          <div className="payment-methods">
            {METHODS.map(m => (
              <button
                key={m.key}
                className={`payment-method-btn ${method === m.key ? 'active' : ''}`}
                onClick={() => setMethod(m.key)}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                {m.label}
              </button>
            ))}
          </div>

          {/* Card Form */}
          {showCardForm && (
            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Card Details</h4>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className="form-input" placeholder="1234 5678 9012 3456"
                  maxLength={19} value={card.cardNumber}
                  onChange={e => setCard({ ...card, cardNumber: e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim() })} />
              </div>
              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input className="form-input" placeholder="JOHN DOE"
                  value={card.cardHolderName} onChange={set('cardHolderName')} />
              </div>
              <div className="card-form">
                <div className="form-group">
                  <label className="form-label">Expiry Month (MM)</label>
                  <input className="form-input" placeholder="MM" maxLength={2}
                    value={card.expiryMonth} onChange={set('expiryMonth')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Year (YYYY)</label>
                  <input className="form-input" placeholder="YYYY" maxLength={4}
                    value={card.expiryYear} onChange={set('expiryYear')} />
                </div>
              </div>
              <div className="form-group" style={{ maxWidth: 160 }}>
                <label className="form-label">CVV</label>
                <input className="form-input" placeholder="•••" maxLength={4} type="password"
                  value={card.cvv} onChange={set('cvv')} />
              </div>
            </div>
          )}

          {method === 'NET_BANKING' && (
            <div style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Select Bank</label>
                <select className="form-input form-select">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            </div>
          )}

          {method === 'GIFT_POINTS' && (
            <div style={{ marginTop: 16, background: '#fff3e0', padding: 16, borderRadius: 6 }}>
              <p style={{ fontSize: 14 }}>
                🎁 You are paying <strong>${totalAmount?.toFixed(2)}</strong> using gift points.
                You need <strong>{Math.ceil(totalAmount * 100)}</strong> points.
                {user?.giftPoints < Math.ceil(totalAmount * 100) && (
                  <span style={{ color: '#c62828' }}> You don't have enough points!</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="order-summary">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          {cartItems?.map(item => (
            <div key={item.id} className="summary-row">
              <span style={{ fontSize: 13 }}>{item.product.title.substring(0, 22)}... × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {giftPointsToRedeem > 0 && (
            <div className="summary-row" style={{ color: '#2e7d32' }}>
              <span>Gift Points Discount</span>
              <span>− ${(giftPointsToRedeem * 0.01).toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span><span style={{ color: '#2e7d32' }}>FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total to Pay</span>
            <span>${totalAmount?.toFixed(2)}</span>
          </div>
          <button className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: 16 }}
            onClick={handlePay} disabled={loading}>
            {loading ? 'Processing...' : `Pay $${totalAmount?.toFixed(2)}`}
          </button>
          <p style={{ fontSize: 11, color: '#757575', textAlign: 'center', marginTop: 8 }}>
            🔒 Secured by 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
