import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Papa from 'papaparse';
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';

// CSV file paths
const CSV_PATHS = {
  products: `${FileSystem.documentDirectory}products.csv`,
  pincodes: `${FileSystem.documentDirectory}pincodes.csv`,
  stock: `${FileSystem.documentDirectory}stock.csv`,
};

const copyAssetToDocumentDirectory = async (localUri, documentPath) => {
  try {
    if (!localUri) {
      throw new Error("Asset URI is unavailable");
    }

    await FileSystem.copyAsync({
      from: localUri,
      to: documentPath,
    });

    console.log(`Successfully copied asset to ${documentPath}`);
    return documentPath;
  } catch (error) {
    console.error("Error copying CSV file:", error);
    throw new Error("Failed to copy CSV file");
  }
};

const fetchCSVData = async (filePath) => {
  try {
    const csv = await FileSystem.readAsStringAsync(filePath);
    console.log("CSV Data:", csv); // Debugging log
    return Papa.parse(csv, { header: true }).data;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    throw new Error("Failed to read CSV file");
  }
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [stock, setStock] = useState([]);
  const [pincode, setPincode] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');
  const [countdown, setCountdown] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState({
    name: "Sample Product",
    price: "₹ 0",
    size: "0 ml",
    quantity: 1,
    stock: true,
    imageUrl: "https://example.com/product-image.jpg",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productAsset = require('./assets/products.csv');
      const pincodeAsset = require('./assets/pincodes.csv');
      const stockAsset = require('./assets/stock.csv');

      console.log("Loading assets...");
      await Promise.all([
        copyAssetToDocumentDirectory(productAsset, CSV_PATHS.products),
        copyAssetToDocumentDirectory(pincodeAsset, CSV_PATHS.pincodes),
        copyAssetToDocumentDirectory(stockAsset, CSV_PATHS.stock),
      ]);

      // Fetch CSV data
      const productsData = await fetchCSVData(CSV_PATHS.products);
      const pincodesData = await fetchCSVData(CSV_PATHS.pincodes);
      const stockData = await fetchCSVData(CSV_PATHS.stock);

      setProducts(productsData);
      setPincodes(pincodesData);
      setStock(stockData);

      console.log("CSV data loaded successfully.");
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Could not load CSV data. Please check the file paths.");
    }
  };

  const getProviderByPincode = (pincode) => {
    return pincodes.find(p => p.pincode === pincode);
  };

  const calculateDeliveryDate = (providerName, regionType) => {
    const currentTime = moment();
    const cutoffTime = moment().set({ hour: 15, minute: 0 });

    if (currentTime.isBefore(cutoffTime)) {
      setCountdown(`${cutoffTime.diff(currentTime, 'minutes')} minutes left for same-day delivery`);
      setEstimatedDate(currentTime.format('YYYY-MM-DD'));
      return currentTime.format('YYYY-MM-DD');
    }

    setCountdown('');

    let estimated;

    if (providerName === "Provider A") {
      const provider = { same_day_cutoff: '14:00' };
      const cutoff = moment(provider.same_day_cutoff, 'HH:mm ');

      if (currentTime.isBefore(cutoff)) {
        setCountdown(`${cutoff.diff(currentTime, 'minutes')} mins left for same-day delivery`);
        estimated = currentTime.format('YYYY-MM-DD');
      } else {
        estimated = currentTime.add(1, 'day').format('YYYY-MM-DD');
      }
    } else if (providerName === "Provider B") {
      const provider = { next_day_cutoff: '14:00' };
      const cutoff = moment(provider.next_day_cutoff, 'HH:mm');

      if (currentTime.isBefore(cutoff)) {
        setCountdown(`${cutoff.diff(currentTime, 'minutes')} mins left for same-day delivery`);
        estimated = currentTime.format('YYYY-MM-DD');
      } else {
        estimated = currentTime.add(1, 'day').format('YYYY-MM-DD');
      }
    } else {
      const deliveryRange = regionType === 'metro' ? 2 : regionType === 'non-metro' ? 3 : 5;
      estimated = currentTime.add(deliveryRange, 'days').format('YYYY-MM-DD');
    }

    return estimated;
  };

  const handleEstimateDelivery = () => {
    const providerData = getProviderByPincode(pincode);

    if (!providerData) {
      Alert.alert('Invalid Pincode', 'Please enter a valid pincode.');
      return;
    }

    if (!selectedProduct.stock) {
      Alert.alert('Out of Stock', 'The selected product is currently out of stock.');
      return;
    }

    const estimated = calculateDeliveryDate(providerData.provider, providerData.region_type);
    setEstimatedDate(estimated);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.breadcrumb}>Home / Skin Serum</Text>
      <Text style={styles.productTitle}>{selectedProduct.name}</Text>
      <Image source={{ uri: selectedProduct.imageUrl }} style={styles.productImage} />

      <View style={styles.badgeContainer}>
        <Text style={styles.badge}>101% Original</Text>
        <Text style={styles.badge}>Lowest Price</Text>
        <Text style={styles.badge}>Free Shipping</Text>
      </View>

      <Text style={styles.price}>{selectedProduct.price}</Text>
      <Text style={styles.stockStatus}>Hurry, Few Left!</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleEstimateDelivery}>
        <Text style={styles.buttonText}>Estimate Delivery Date</Text>
      </TouchableOpacity>

      {estimatedDate ? (
        <Text style={styles.result}>Estimated Delivery Date: {estimatedDate}</Text>
      ) : null}

      {countdown ? (
        <Text style={styles.countdown}>Countdown: {countdown}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  breadcrumb: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  badge: {
    padding: 5,
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#a5d6a7',
    borderRadius: 5,
    overflow: 'hidden',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  stockStatus: {
    color: '#e64a19',
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
  countdown: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
  },
});