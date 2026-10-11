import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI, brandAPI } from '../api';
import ProductCard from '../components/ProductCard';

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const selectedCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null;
  const selectedBrandId = searchParams.get('brandId') ? Number(searchParams.get('brandId')) : null;
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') || 0);

  useEffect(() => {
    Promise.all([categoryAPI.getAll(), brandAPI.getAll()]).then(([c, b]) => {
      setCategories(c.data);
      setBrands(b.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, size: 12 };
    if (selectedCategoryId) params.categoryId = selectedCategoryId;
    if (selectedBrandId) params.brandId = selectedBrandId;
    if (search) params.search = search;

    productAPI.getAll(params).then(res => {
      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    }).finally(() => setLoading(false));
  }, [selectedCategoryId, selectedBrandId, search, page]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '0');
    setSearchParams(next);
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ marginBottom: 24, fontSize: 26, fontWeight: 700 }}>
        {search ? `Results for "${search}"` : 'Book Catalogue'}
      </h1>

      <div className="catalogue-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Filters</h3>

          <div className="filter-section">
            <h4>Category</h4>
            <label className="filter-option">
              <input type="radio" name="cat" checked={!selectedCategoryId}
                onChange={() => setFilter('categoryId', null)} /> All Categories
            </label>
            {categories.map(c => (
              <label key={c.id} className="filter-option">
                <input type="radio" name="cat" checked={selectedCategoryId === c.id}
                  onChange={() => setFilter('categoryId', c.id)} />
                {c.name}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Publisher / Brand</h4>
            <label className="filter-option">
              <input type="radio" name="brand" checked={!selectedBrandId}
                onChange={() => setFilter('brandId', null)} /> All Publishers
            </label>
            {brands.map(b => (
              <label key={b.id} className="filter-option">
                <input type="radio" name="brand" checked={selectedBrandId === b.id}
                  onChange={() => setFilter('brandId', b.id)} />
                {b.name}
              </label>
            ))}
          </div>

          {(selectedCategoryId || selectedBrandId || search) && (
            <button className="btn btn-outline btn-sm" style={{ width: '100%' }}
              onClick={() => setSearchParams({})}>
              Clear Filters
            </button>
          )}
        </aside>

        {/* Products */}
        <main className="catalogue-main">
          {loading ? (
            <div className="loading">Loading books...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No books found</h3>
              <p>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <p style={{ marginBottom: 16, color: '#757575', fontSize: 14 }}>
                Showing {products.length} book{products.length !== 1 ? 's' : ''}
              </p>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} className={`btn btn-sm ${i === page ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => { const n = new URLSearchParams(searchParams); n.set('page', i); setSearchParams(n); }}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
