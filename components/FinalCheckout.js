import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const FinalCheckout = ({ item }) => {
  // Destructure the relevant properties from the item object
  const { name, price, quantity } = item;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "white",
      }}
    >
      {/* Display item quantity and name like "2xPotato" */}
      <Text style={{ fontWeight: "700", color: "black" }}>
        {quantity}Kg {name}
      </Text>

      {/* Display the price adjusted for the quantity */}
      <Text style={{ fontWeight: "600", color: "black" }}>
        {"₹"}{price * quantity}
      </Text>
    </View>
  );
};

export default FinalCheckout;

const styles = StyleSheet.create({});
