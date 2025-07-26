import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { addressState, deliveryEstimateState } from './atoms';
import './DeliveryEstimate.css';

function DeliveryEstimate() {
  const [pincode, setPincode] = useState('');
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([]);
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="delivery-estimate">
      <h2>Delivery Estimation</h2>
      
      <div className="form-group">
        <label htmlFor="product">Select Product (Optional):</label>
        <select 
          id="product"
          value={productId} 
          onChange={(e) => setProductId(e.target.value)}
          className="form-control"
        >
          <option value="">Choose a product...</option>
          {products.map(product => (
            <option key={product['Product ID']} value={product['Product ID']}>
              {product['Product Name']} - ₹{product.Price} 
              {product.stockAvailable ? ' (In Stock)' : ' (Out of Stock)'}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="pincode">Enter Pincode:</label>
        <input
          id="pincode"
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter your pincode"
          className="form-control"
          maxLength="6"
        />
      </div>

      <button 
        onClick={getEstimate} 
        disabled={loading || !pincode}
        className="estimate-button"
      >
        {loading ? 'Getting Estimate...' : 'Get Delivery Estimate'}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {deliveryEstimate && (
        <div className="estimate-result">
          <h3>Delivery Estimate</h3>
          <div className="estimate-details">
            <p><strong>Pincode:</strong> {deliveryEstimate.pincode}</p>
            <p><strong>Provider:</strong> {deliveryEstimate.provider}</p>
            <p><strong>TAT:</strong> {deliveryEstimate.tat} days</p>
            <p><strong>Estimated Delivery Date:</strong> {deliveryEstimate.estimatedDate}</p>
            {deliveryEstimate.isSameDay && (
              <p className="same-day-badge">Same Day Delivery Available!</p>
            )}
            {deliveryEstimate.countdown && (
              <p className="countdown">{deliveryEstimate.countdown}</p>
            )}
            <p><strong>Stock Status:</strong> 
              <span className={deliveryEstimate.stockAvailable ? 'in-stock' : 'out-of-stock'}>
                {deliveryEstimate.stockAvailable ? ' In Stock' : ' Out of Stock'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryEstimate;
