import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home-screen">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Premium Skin Care Products</h1>
          <p>Discover our curated collection of dermatologist-recommended products</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        <div className="section-header">
          <h2>Our Products</h2>
          <p>Choose from our selection of premium skin care products</p>
        </div>
        
        <div className="products-grid">
          {products.map(product => (
            <div 
              key={product['Product ID']}
              className="product-card"
              onClick={() => handleProductClick(product['Product ID'])}
            >
              <div className="product-image">
                <img 
                  src={`https://via.placeholder.com/300x300/8B4513/FFFFFF?text=${product['Product Name'].split(' ')[0]}`}
                  alt={product['Product Name']}
                />
                {!product.stockAvailable && (
                  <div className="out-of-stock-badge">Out of Stock</div>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product['Product Name']}</h3>
                <p className="product-description">{product.Description}</p>
                
                <div className="product-benefits">
                  {product.Benefits && product.Benefits.slice(0, 2).map((benefit, index) => (
                    <span key={index} className="benefit-tag">
                      <i className="fas fa-check"></i>
                      {benefit}
                    </span>
                  ))}
                </div>
                
                <div className="product-meta">
                  <div className="product-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-text">{product.Rating}</span>
                    <span className="reviews">({product.Reviews} reviews)</span>
                  </div>
                  
                  <div className="product-size">
                    <i className="fas fa-flask"></i>
                    {product.Size}
                  </div>
                </div>
                
                <div className="product-price-section">
                  <div className="price">
                    <span className="currency">₹</span>
                    <span className="amount">{product.Price}</span>
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className="view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product['Product ID']);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature">
          <i className="fas fa-shipping-fast"></i>
          <h3>Fast Delivery</h3>
          <p>Same day delivery available</p>
        </div>
        <div className="feature">
          <i className="fas fa-shield-alt"></i>
          <h3>Authentic Products</h3>
          <p>100% genuine products</p>
        </div>
        <div className="feature">
          <i className="fas fa-undo"></i>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen; 