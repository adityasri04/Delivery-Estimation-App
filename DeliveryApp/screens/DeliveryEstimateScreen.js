import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import CountdownTimer from '../components/CountDownTimer';
import { estimateDelivery } from '../utils/DeliveryEstimation';

const DeliveryEstimateScreen = ({ route }) => {
  const { product } = route.params;
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState('');
  const [provider, setProvider] = useState(null);
  const [deadline, setDeadline] = useState(null);

  // Validate pincode and associate provider
  const validatePincode = () => {
    if (!validPincodes.has(parseInt(pincode))) {
      setError('Invalid pincode');
    } else {
      setError('');
      determineProvider();
    }
  };

  // Determine provider and estimate delivery based on provider rules
  const determineProvider = () => {
    const currentTime = new Date();
    // Simulate provider determination based on pincode
    const selectedProvider = pincode % 3 === 0 ? 'Provider A' : (pincode % 3 === 1 ? 'Provider B' : 'General Partners');
    setProvider(selectedProvider);

    const pincodeType = determinePincodeType(pincode); // Helper function to categorize pincode by region (e.g., metro, non-metro)

    // Estimate delivery date
    const estimate = estimateDelivery(selectedProvider, currentTime, pincodeType);
    setDeliveryEstimate(estimate);

    // Set countdown timer if eligible for same-day delivery
    if (selectedProvider === 'Provider A' && currentTime.getHours() < 17) {
      setDeadline(new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 17, 0, 0)); // 5 PM
    } else if (selectedProvider === 'Provider B' && currentTime.getHours() < 9) {
      setDeadline(new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 9, 0, 0)); // 9 AM
    } else {
      setDeadline(null); // No countdown for other cases
    }
  };

  return (
    <View>
      <Text>Selected Product: {product.name}</Text>
      <TextInput
        placeholder="Enter Pincode"
        keyboardType="numeric"
        onChangeText={(text) => setPincode(text)}
        style={{ borderWidth: 1, margin: 10 }}
      />
      {error ? <Text>{error}</Text> : null}
      <Button title="Check Delivery Date" onPress={validatePincode} />
      {deliveryEstimate && <Text>Estimated Delivery: {deliveryEstimate}</Text>}
      {deadline && <CountdownTimer deadline={deadline} />} {/* Show countdown if there's a deadline */}
    </View>
  );
};

export default DeliveryEstimateScreen;
