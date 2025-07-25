import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { addressState, deliveryEstimateState } from './atoms';

function DeliveryEstimate() {
  const [address, setAddress] = useRecoilState(addressState);
  const [deliveryEstimate, setDeliveryEstimate] = useRecoilState(deliveryEstimateState);
  const [loading, setLoading] = useState(false);

  const getEstimate = async () => {
    setLoading(true);
    const response = await fetch(`/api/estimate?address=${address}`);
    const data = await response.json();
    setDeliveryEstimate(data);
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your address"
      />
      <button onClick={getEstimate} disabled={loading}>
        {loading ? 'Getting Estimate...' : 'Get Estimate'}
      </button>
      {deliveryEstimate && (
        <div>
          <h2>Delivery Estimate</h2>
          <p>Address: {deliveryEstimate.address}</p>
          <p>Estimated Delivery Time: {deliveryEstimate.deliveryTime}</p>
        </div>
      )}
    </div>
  );
}

export default DeliveryEstimate;
