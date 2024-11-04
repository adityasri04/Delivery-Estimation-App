import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProductInfo({ product, checkAvailability }) {
  return (
    <View style={styles.productContainer}>
      <Image source={{ uri: product.image_url }} style={styles.productImage} />
      <Text style={styles.productTitle}>{product.name}</Text>
      <Text style={styles.price}>₹ {product.price}</Text>
      <TouchableOpacity style={styles.stockButton} onPress={checkAvailability}>
        <Text style={styles.stockButtonText}>Check Stock</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: '600',
  },
  stockButton: {
    backgroundColor: '#5E35B1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  stockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});