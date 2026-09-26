import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../api';
import { toast } from 'react-toastify';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.order) {
    navigate('/');
    return null;
  }

  const { order, payment } = state;

  const handleCancelOrder = async () => {
    try {
      await orderAPI.cancelOrder(order.id);
      toast.success('Order cancelled successfully.');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    }
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Steps */}
      <div className="steps">
        <div className="step done">1. Cart</div>
        <div className="step done">2. Delivery Address</div>
        <div className="step done">3. Payment</div>
        <div className="step active">4. Confirmation</div>
      </div>

      <div className="confirmation-box">
        <div className="confirmation-icon">✅</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>

        <div className="order-details-card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#757575', fontWeight: 600 }}>ORDER ID</div>
              <div style={{ fontWeight: 700 }}>#{order.id}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#757575', fontWeight: 600 }}>PAYMENT</div>
              <div style={{ fontWeight: 700, color: '#2e7d32' }}>
                {payment?.status} via {payment?.method?.replace('_', ' ')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#757575', fontWeight: 600 }}>ESTIMATED DELIVERY</div>
              <div style={{ fontWeight: 700 }}>
                {order.estimatedDeliveryDate
                  ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Within 5 business days'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#757575', fontWeight: 600 }}>TOTAL PAID</div>
              <div style={{ fontWeight: 700, color: '#ff6f00', fontSize: 18 }}>${Number(order.totalAmount).toFixed(2)}</div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />

          <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Items Ordered</h4>
          {order.items?.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span>{item.product?.title} × {item.quantity}</span>
              <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          {order.address && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />
              <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Delivery Address</h4>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                {order.address.fullName}<br />
                {order.address.street}, {order.address.city}<br />
                {order.address.state} {order.address.postalCode}, {order.address.country}
              </p>
            </>
          )}

          {order.giftPointsUsed > 0 && (
            <p style={{ marginTop: 12, fontSize: 13, color: '#757575' }}>
              🎁 {order.giftPointsUsed} gift points redeemed
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-primary">View My Orders</Link>
          <Link to="/catalogue" className="btn btn-outline">Continue Shopping</Link>
          <button className="btn btn-danger" onClick={handleCancelOrder}>
            Cancel Order
          </button>
        </div>
        <p style={{ fontSize: 12, color: '#757575', marginTop: 12 }}>
          * Orders can be cancelled within 48 hours of placement
        </p>
      </div>
    </div>
  );
}
