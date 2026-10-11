import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI, cartAPI } from '../api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const statusColors = {
  PENDING: '#e65100', CONFIRMED: '#e65100', SHIPPED: '#1565c0',
  DELIVERED: '#2e7d32', CANCELLED: '#c62828',
};

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getOrders(user.id)
      .then(res => setOrders(res.data || []))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleCancel = async (orderId) => {
    try {
      const res = await orderAPI.cancelOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    }
  };

  const handleBuyAgain = async (order) => {
    try {
      for (const item of order.items) {
        await cartAPI.addItem(user.id, { productId: item.product.id, quantity: item.quantity });
      }
      await refreshCart();
      toast.success('Items added to cart! Ready to buy again.');
    } catch {
      toast.error('Failed to add items to cart');
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
          <h3>No orders yet</h3>
          <p>Browse our catalogue and place your first order!</p>
          <Link to="/catalogue" className="btn btn-primary mt-16">Shop Now</Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div>
                <span style={{ fontWeight: 700 }}>Order #{order.id}</span>
                <span style={{ marginLeft: 16, fontSize: 13, color: '#757575' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span className={`order-status status-${order.status}`}>{order.status}</span>
                <span style={{ fontWeight: 700, color: '#ff6f00' }}>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ padding: '12px 20px' }}>
              {order.items?.slice(0, expanded === order.id ? undefined : 2).map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <img
                    src={item.product?.imageUrl || 'https://via.placeholder.com/50x60?text=Book'}
                    alt={item.product?.title}
                    style={{ width: 50, height: 60, borderRadius: 4, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.product?.title}</div>
                    <div style={{ fontSize: 12, color: '#757575' }}>by {item.product?.author}</div>
                    <div style={{ fontSize: 13 }}>Qty: {item.quantity} × ${item.unitPrice?.toFixed(2)}</div>
                  </div>
                  <Link to={`/products/${item.product?.id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                </div>
              ))}

              {order.items?.length > 2 && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  {expanded === order.id ? 'Show Less' : `+ ${order.items.length - 2} more items`}
                </button>
              )}

              {order.estimatedDeliveryDate && order.status !== 'CANCELLED' && (
                <p style={{ fontSize: 13, color: '#1565c0', marginTop: 10 }}>
                  📦 Estimated delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-accent btn-sm" onClick={() => handleBuyAgain(order)}>
                  🔁 Buy Again
                </button>
                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(order.id)}>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
