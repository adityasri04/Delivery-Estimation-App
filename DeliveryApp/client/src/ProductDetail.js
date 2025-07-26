import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
      setLoading(false);
    }
  };

  const getEstimate = async () => {
    if (!pincode) {
      setError('Please enter a pincode');
      return;
    }

    setEstimateLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/estimate?pincode=${pincode}&productId=${productId}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to get estimate');
        setDeliveryEstimate(null);
      } else {
        setDeliveryEstimate(data);
        setError('');
      }
    } catch (error) {
      console.error('Error getting estimate:', error);
      setError('Failed to connect to server');
      setDeliveryEstimate(null);
    } finally {
      setEstimateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p>Product not found</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i>
          Back to Products
        </button>
      </div>

      <div className="product-detail-content">
        {/* Product Image Section */}
        <div className="product-image-section">
          <div className="product-image-container">
            <img 
              src={`https://via.placeholder.com/400x500/8B4513/FFFFFF?text=${product['Product Name'].split(' ')[0]}`}
              alt={product['Product Name']}
              className="product-image"
            />
            <button className="zoom-button">
              <i className="fas fa-search-plus"></i>
            </button>
          </div>
          <div className="image-navigation">
            <button className="nav-arrow">
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="image-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <button className="nav-arrow">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="product-info-section">
          {/* Product Header */}
          <div className="product-header">
            <h1 className="product-title">{product['Product Name']}</h1>
            <div className="product-benefits">
              {product.Benefits && product.Benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <i className="fas fa-check-circle benefit-icon"></i>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <i className="fas fa-shield-alt trust-icon purple"></i>
              <span>101% Original</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-tag trust-icon red"></i>
              <span>Lowest Price</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-truck trust-icon blue"></i>
              <span>Free Shipping</span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="pricing-section">
            <div className="price-info">
              <div className="price">
                <span className="currency">MRP ₹</span>
                <span className="amount">{product.Price}</span>
              </div>
              <div className="tax-info">(incl. of all taxes)</div>
            </div>
            <div className="stock-status">
              {product.stockAvailable ? (
                <button className="hurry-button">Hurry, Few Left!</button>
              ) : (
                <button className="out-of-stock-button">Out of Stock</button>
              )}
            </div>
          </div>

          {/* Product Options */}
          <div className="product-options">
            <div className="option-group">
              <label>Size:</label>
              <button className="size-button">{product.Size}</button>
            </div>
            <div className="option-group">
              <label>Qty:</label>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="quantity-select"
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="engagement-metrics">
            <div className="metric">
              <i className="fas fa-chart-line metric-icon"></i>
              <span>Recently in {product.InCarts || '951'} carts</span>
            </div>
          </div>

          {/* Available Offers */}
          <div className="offers-section">
            <h3 className="offers-title">Available offers</h3>
            <div className="offer-item">
              <i className="fas fa-medal offer-icon"></i>
              <span>Get free shipping</span>
            </div>
          </div>

          {/* Reviews and Delivery */}
          <div className="reviews-delivery">
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="rating-text">{product.Rating || '4.73'}</span>
              <span className="reviews-count">({product.Reviews || '139'} Reviews)</span>
            </div>
            <div className="delivery-info">
              <i className="fas fa-truck delivery-icon"></i>
              <span>Get it By Oct. 24</span>
            </div>
          </div>

          {/* Delivery Estimation */}
          <div className="delivery-estimation">
            <div className="pincode-section">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="pincode-input"
                maxLength="6"
              />
              <button 
                onClick={getEstimate} 
                disabled={estimateLoading || !pincode}
                className="check-delivery-button"
              >
                {estimateLoading ? 'Checking...' : 'Check Delivery'}
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {deliveryEstimate && (
              <div className="delivery-result">
                <div className="delivery-details">
                  <div className="delivery-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Estimated Delivery: {deliveryEstimate.estimatedDate}</span>
                  </div>
                  {deliveryEstimate.isSameDay && (
                    <div className="same-day-badge">
                      <i className="fas fa-bolt"></i>
                      Same Day Delivery Available!
                    </div>
                  )}
                  {deliveryEstimate.countdown && (
                    <div className="countdown">
                      <i className="fas fa-clock"></i>
                      {deliveryEstimate.countdown}
                    </div>
                  )}
                  <div className="provider-info">
                    <span>Provider: {deliveryEstimate.provider}</span>
                    <span>TAT: {deliveryEstimate.tat} days</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Call to Action Buttons */}
          <div className="action-buttons">
            <button className="add-to-cart-button" disabled={!product.stockAvailable}>
              <i className="fas fa-shopping-cart"></i>
              Add to cart
            </button>
            <button className="buy-now-button" disabled={!product.stockAvailable}>
              <i className="fas fa-bolt"></i>
              Buy it now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 