import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product.id, 1);
      toast.success(`"${product.title}" added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (product.estimatedDeliveryDays || 5));

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Book'}
        alt={product.title}
      />
      <div className="product-card-body">
        <div className="product-card-title">{product.title}</div>
        <div className="product-card-author">by {product.author}</div>
        <div className="product-card-price">${product.price?.toFixed(2)}</div>
        <div className="product-card-delivery">
          📦 Est. delivery by {deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
        <button className="btn btn-accent btn-sm" style={{ width: '100%' }} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
