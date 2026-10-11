import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getById(id),
      productAPI.getRelated(id),
    ]).then(([p, r]) => {
      setProduct(p.data);
      setRelated(r.data?.slice(0, 4) || []);
    }).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product.id, qty);
      toast.success(`Added ${qty} × "${product.title}" to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product.id, qty);
      navigate('/cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (product.estimatedDeliveryDays || 5));

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Main Product */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, marginBottom: 48 }}>
        <div>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400x500?text=Book'}
            alt={product.title}
            style={{ width: '100%', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', maxHeight: 460, objectFit: 'cover' }}
          />
        </div>

        <div>
          <p style={{ fontSize: 13, color: '#757575', marginBottom: 8 }}>
            {product.category?.name} › {product.brand?.name}
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{product.title}</h1>
          <p style={{ fontSize: 16, color: '#555', marginBottom: 16 }}>by <strong>{product.author}</strong></p>

          <div style={{ fontSize: 32, fontWeight: 800, color: '#ff6f00', marginBottom: 16 }}>
            ${product.price?.toFixed(2)}
          </div>

          <div style={{ background: '#f1f8e9', padding: '10px 14px', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
            ✅ In Stock ({product.stockQuantity} available) &nbsp;|&nbsp;
            📦 Est. delivery by <strong>{deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', marginBottom: 24 }}>
            {product.description || 'No description available for this book.'}
          </p>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Quantity:</span>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-accent btn-lg" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleBuyNow}>
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Related Books</h2>
          <div className="products-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
