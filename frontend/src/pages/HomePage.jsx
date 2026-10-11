import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ page: 0, size: 8 }),
      categoryAPI.getAll(),
    ]).then(([prodRes, catRes]) => {
      setFeaturedProducts(prodRes.data.content || []);
      setCategories(catRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>Discover Your Next Great Read</h1>
        <p>Browse thousands of books across every genre. Fast delivery, competitive prices and personalised recommendations.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-accent btn-lg" onClick={() => navigate('/catalogue')}>
            Browse Catalogue
          </button>
          <button className="btn btn-outline btn-lg" style={{ borderColor: '#fff', color: '#fff' }}
            onClick={() => navigate('/register')}>
            Join Free
          </button>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '48px 24px' }}>
        <div className="container">
          <h2 style={{ marginBottom: 24, fontSize: 22, fontWeight: 700 }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/catalogue?categoryId=${cat.id}`}
                style={{
                  background: '#fff', borderRadius: 8, overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center',
                  padding: 20, fontWeight: 600, fontSize: 14,
                  transition: '0.2s', display: 'block',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>
                  {['📖', '📰', '💻', '💼', '🧒', '🧘'][cat.id - 1] || '📚'}
                </div>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section style={{ padding: '0 24px 48px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Featured Books</h2>
            <Link to="/catalogue" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          {loading ? (
            <div className="loading">Loading books...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Value Props */}
      <section style={{ background: '#fff', padding: '48px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'center' }}>
            {[
              { icon: '🚚', title: 'Fast Delivery', desc: 'Get books delivered in 3-5 business days' },
              { icon: '🎁', title: 'Gift Points', desc: 'Earn points on every purchase and redeem for discounts' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Credit card, debit card or net banking' },
              { icon: '↩️', title: 'Cancel Orders', desc: 'Cancel within 48 hours of placing your order' },
            ].map(({ icon, title, desc }) => (
              <div key={title}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: '#757575' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
