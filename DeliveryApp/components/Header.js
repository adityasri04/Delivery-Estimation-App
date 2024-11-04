import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.header}>
      <Ionicons name="menu" size={24} color="black" />
      <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY_yyTRp4xOqpn9876_F2A6UskSj1AtjPAOg&s' }} style={styles.logo} />
      <Ionicons name="cart" size={24} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
});
