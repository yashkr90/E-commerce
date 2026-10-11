import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { userAPI } from '../api';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [giftPoints, setGiftPoints] = useState(0);
  const [newAddr, setNewAddr] = useState({ fullName: '', street: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });

  useEffect(() => {
    userAPI.getAddresses(user.id).then(res => {
      setAddresses(res.data);
      if (res.data.length > 0) setSelectedAddress(res.data.find(a => a.isDefault) || res.data[0]);
    });
  }, [user.id]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.addAddress(user.id, newAddr);
      setAddresses(prev => [...prev, res.data]);
      setSelectedAddress(res.data);
      setShowAddForm(false);
      setNewAddr({ fullName: '', street: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });
      toast.success('Address added!');
    } catch {
      toast.error('Failed to add address');
    }
  };

  const total = cart?.totalAmount || cart?.items?.reduce((s, i) => s + i.product.price * i.quantity, 0) || 0;
  const pointsDiscount = Math.min(giftPoints, user?.giftPoints || 0) * 0.01;
  const finalTotal = Math.max(0, Number(total) - pointsDiscount);

  const handleProceed = () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    navigate('/payment', {
      state: {
        addressId: selectedAddress.id,
        giftPointsToRedeem: giftPoints,
        totalAmount: finalTotal,
        cartItems: cart.items,
      }
    });
  };

  const set = (f) => (e) => setNewAddr({ ...newAddr, [f]: e.target.value });

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Checkout</h1>

      {/* Steps */}
      <div className="steps">
        <div className="step done">1. Cart</div>
        <div className="step active">2. Delivery Address</div>
        <div className="step">3. Payment</div>
        <div className="step">4. Confirmation</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>
        <div>
          <div className="card card-body" style={{ marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Select Delivery Address</h3>
            <div className="address-grid">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className={`address-card ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{addr.fullName}</div>
                  <div style={{ fontSize: 13, color: '#555' }}>
                    {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                  </div>
                  <div style={{ fontSize: 13, color: '#555' }}>{addr.country}</div>
                  {addr.isDefault && <span style={{ fontSize: 11, color: '#1a237e', fontWeight: 600 }}>✓ Default</span>}
                </div>
              ))}
              <div
                className="address-card"
                style={{ border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 100 }}
                onClick={() => setShowAddForm(true)}
              >
                <span style={{ color: '#757575', fontSize: 14 }}>+ Add New Address</span>
              </div>
            </div>
          </div>

          {/* Add Address Form */}
          {showAddForm && (
            <div className="card card-body" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>New Address</h3>
              <form onSubmit={handleAddAddress}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={newAddr.fullName} onChange={set('fullName')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input className="form-input" value={newAddr.street} onChange={set('street')} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" value={newAddr.city} onChange={set('city')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" value={newAddr.state} onChange={set('state')} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input className="form-input" value={newAddr.postalCode} onChange={set('postalCode')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" value={newAddr.country} onChange={set('country')} required />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Gift Points */}
          {user?.giftPoints > 0 && (
            <div className="card card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>🎁 Redeem Gift Points</h3>
              <p style={{ fontSize: 13, color: '#757575', marginBottom: 12 }}>
                You have <strong>{user.giftPoints}</strong> gift points. 100 points = $1.00 discount.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="number" className="form-input" style={{ maxWidth: 160 }}
                  min={0} max={user.giftPoints}
                  value={giftPoints} onChange={e => setGiftPoints(Number(e.target.value))}
                  placeholder="Points to redeem"
                />
                {pointsDiscount > 0 && (
                  <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: 14 }}>
                    − ${pointsDiscount.toFixed(2)} discount
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="order-summary">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          {cart?.items?.map(item => (
            <div key={item.id} className="summary-row">
              <span style={{ fontSize: 13 }}>{item.product.title.substring(0, 22)}... × {item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span><span>${Number(total).toFixed(2)}</span>
          </div>
          {pointsDiscount > 0 && (
            <div className="summary-row" style={{ color: '#2e7d32' }}>
              <span>Gift Points Discount</span><span>− ${pointsDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span><span style={{ color: '#2e7d32' }}>FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total</span><span>${finalTotal.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }} onClick={handleProceed}>
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}
