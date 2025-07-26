import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { addressState, deliveryEstimateState } from './atoms';
import './DeliveryEstimate.css';

function DeliveryEstimate() {
  const [pincode, setPincode] = useState('');
  const [productId, setProductId] = useState('1');
  const [products, setProducts] = useState([]);
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    }
  };

  const getEstimate = async () => {
    if (!pincode) {
      setError('Please enter a pincode');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const url = productId 
        ? `/api/estimate?pincode=${pincode}&productId=${productId}`
        : `/api/estimate?pincode=${pincode}`;
      
      const response = await fetch(url);
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
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p['Product ID'] === productId) || {
    'Product Name': 'Sesderma Azelac RU Liposomal Serum',
    'Price': '2650',
    'Benefits': ['Lightens Spots', 'Targets Pigmentation', 'Evens Skin Tone'],
    'Size': '30 ml',
    'Rating': '4.73',
    'Reviews': '139',
    'InCarts': '951',
    stockAvailable: true
  };

  const handleProductChange = (newProductId) => {
    setProductId(newProductId);
    setDeliveryEstimate(null); // Clear previous estimate when product changes
  };

  return (
    <div className="product-page">
      {/* Product Selection */}
      <div className="product-selection">
        <h3 className="selection-title">Select Product:</h3>
        <div className="product-cards">
          {products.map(product => (
            <div 
              key={product['Product ID']}
              className={`product-card ${productId === product['Product ID'] ? 'selected' : ''}`}
              onClick={() => handleProductChange(product['Product ID'])}
            >
              <div className="product-card-image">
                <img 
                  src={`https://via.placeholder.com/80x80/8B4513/FFFFFF?text=${product['Product Name'].split(' ')[0]}`}
                  alt={product['Product Name']}
                />
              </div>
              <div className="product-card-info">
                <h4 className="product-card-name">{product['Product Name']}</h4>
                <p className="product-card-price">₹{product.Price}</p>
                <p className="product-card-size">{product.Size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Title and Benefits */}
      <div className="product-header">
        <h1 className="product-title">{selectedProduct['Product Name']}</h1>
        <div className="product-benefits">
          {selectedProduct.Benefits && selectedProduct.Benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <i className="fas fa-check-circle benefit-icon"></i>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Image Section */}
      <div className="product-image-section">
        <div className="product-image-container">
          <img 
            src={`https://via.placeholder.com/300x400/8B4513/FFFFFF?text=${selectedProduct['Product Name'].split(' ')[0]}`}
            alt={selectedProduct['Product Name']}
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
            <span className="amount">{selectedProduct.Price}</span>
          </div>
          <div className="tax-info">(incl. of all taxes)</div>
        </div>
        <div className="stock-status">
          <button className="hurry-button">Hurry, Few Left!</button>
        </div>
      </div>

      {/* Product Options */}
      <div className="product-options">
        <div className="option-group">
          <label>Size:</label>
          <button className="size-button">{selectedProduct.Size}</button>
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
          <span>Recently in {selectedProduct.InCarts || '951'} carts</span>
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
          <span className="rating-text">{selectedProduct.Rating || '4.73'}</span>
          <span className="reviews-count">({selectedProduct.Reviews || '139'} Reviews)</span>
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
            disabled={loading || !pincode}
            className="check-delivery-button"
          >
            {loading ? 'Checking...' : 'Check Delivery'}
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
        <button className="add-to-cart-button">
          <i className="fas fa-shopping-cart"></i>
          Add to cart
        </button>
        <button className="buy-now-button">
          <i className="fas fa-bolt"></i>
          Buy it now
        </button>
      </div>
    </div>
  );
}

export default DeliveryEstimate;
