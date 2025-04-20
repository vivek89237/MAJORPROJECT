import React, { useState, useEffect } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const Menu = ({ menu, cart, setCart }) => {
  const [additems, setAdditems] = useState(0);
  const [inputQuantity, setInputQuantity] = useState("0");
  const [unit, setUnit] = useState(menu.unit === "kg" || menu.unit === "g" ? "kg" : menu.unit);
  const navigation = useNavigation(); 

  // Clear the cart when the back button is pressed


  const calculateFinalQuantity = (quantity) => {
    return unit === "g" ? quantity / 1000 : quantity;
  };

  const updateCart = (quantity, unitParam = unit) => {
    const finalQuantity = unitParam === "g" ? quantity / 1000 : quantity;
  
    if (finalQuantity > 0) {
      const itemIndex = cart.findIndex((item) => item.id === menu.id);
      if (itemIndex > -1) {
        const updatedCart = cart.map((item, index) => {
          if (index === itemIndex) {
            return { ...item, quantity: finalQuantity, unit: unitParam };
          }
          return item;
        });
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...menu, quantity: finalQuantity, unit: unitParam }]);
      }
    } else {
      const updatedCart = cart.filter((item) => item.id !== menu.id);
      setCart(updatedCart);
    }
  };
  
  

  const handleQuantityChange = (value) => {
    const qty = parseFloat(value) || 0;
    setAdditems(qty);
    setInputQuantity(value);
    updateCart(qty, unit); // Pass unit directly
  };
  
  const addToCart = () => {
    const newQty = additems + 1;
    setAdditems(newQty);
    setInputQuantity(newQty.toString());
    updateCart(newQty, unit);
  };
  
  const removeFromCart = () => {
    if (additems <= 0) return;
    const newQty = additems - 1;
    setAdditems(newQty);
    setInputQuantity(newQty.toString());
    updateCart(newQty, unit);
  };

  return (
    <Pressable>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 13,
          }}
        >
          <View>
            <Text
              style={{
                width: 160,
                marginLeft: 10,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {menu.name}
            </Text>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                marginVertical: 4,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              ₹{menu.price} per {menu.unit}
            </Text>

            {/* Picker Dropdown for selecting quantity type (kg/g) */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, marginRight: 7 }}>Select Quantity:</Text>

              {menu.unit === "kg" || menu.unit === "g" ? (
                <Picker
                  selectedValue={unit}
                  style={{
                    height: 50,
                    width: 100,
                    color: "black",
                    backgroundColor: "#e0e0e0",
                    borderRadius: 5,
                  }}
                  onValueChange={(itemValue) => setUnit(itemValue)}
                >
                  <Picker.Item label="kg" value="kg" />
                  <Picker.Item label="g" value="g" />
                </Picker>
              ) : (
                <Text style={{ fontSize: 16, backgroundColor: "#e0e0e0", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}>
                  {menu.unit}
                </Text>
              )}
            </View>

          </View>

          <Image
            style={{
              width: 120,
              height: 120,
              marginRight: 15,
              marginBottom: 20,
              borderRadius: 10,
              resizeMode: "cover",
            }}
            source={{
              uri: menu.image,
            }}
          />
        </View>

        {/* Quantity and Unit Selector - Center Aligned below the image */}
        <View
          style={{
            position: "absolute",
            right: 28,
            top: 115,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#675DFF",
            borderRadius: 5,
          }}
        >
          <Pressable onPress={removeFromCart}>
            <Text
              style={{ fontSize: 25, color: "white", paddingHorizontal: 10 }}
            >
              -
            </Text>
          </Pressable>

          {/* Quantity Input */}
          <TextInput
            style={[styles.input, { width: 62, textAlign: 'center' }]} // Adjust width and alignment
            keyboardType="numeric"
            value={inputQuantity}
            onChangeText={handleQuantityChange}
            maxLength={5}
          />


          <Pressable onPress={addToCart}>
            <Text
              style={{ fontSize: 20, color: "white", paddingHorizontal: 10 }}
            >
              +
            </Text>
          </Pressable>
        </View>

        {/* View Cart Button */}

      </ScrollView>
    </Pressable>
  );
};

export default Menu;

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    color: "white",
    paddingHorizontal: 10,
    width: 50,
    textAlign: "center",
  },
});