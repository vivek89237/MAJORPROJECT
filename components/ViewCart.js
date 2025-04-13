import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { CartItems } from "../Context";
import FinalCheckout from "./FinalCheckout";
import { useNavigation } from "@react-navigation/native";
import uploadCartItems from "../uploadCartItems";
import { useCustomer } from "~/provider/CustomerProvider";

const ViewCart = ({ VendorName, ContactNo }) => {
  const { setAdditems } = useContext(CartItems);
  const { customerContact, customerCoordinates, customerAddress } = useCustomer();
  const navigation = useNavigation();
  const { cart, setCart } = useContext(CartItems);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(customerAddress);

  const total = cart.reduce((prev, item) => prev + item.price * item.quantity, 0);

  const formatDate = (date) => date.toLocaleDateString('en-GB').split('/').join('-');

  const dates = [
    { label: "Today", value: formatDate(new Date()) },
    { label: "Tomorrow", value: formatDate(new Date(Date.now() + 86400000)) },
    { label: "Day After Tomorrow", value: formatDate(new Date(Date.now() + 2 * 86400000)) },
  ];
  
  const [selectedDate, setSelectedDate] = useState(dates[0].value);

  const confirmAddress = async () => {
    setIsLoading(true);
    const isScheduled = selectedDate !== dates[0].value;
    
    try {
      await uploadCartItems(
        cart, 
        VendorName, 
        total, 
        navigation, 
        ContactNo, 
        deliveryAddress, 
        customerContact, 
        customerCoordinates, 
        selectedDate,
        isScheduled
      );
      setCart([]);
      setAdditems(0);
      setModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const openMap = () => {
    navigation.navigate("MapScreen"); // Navigate to map screen
  };

  const checkOut = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.7)",
      }}
    >
      <Pressable
        onPress={() => setModal(false)}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign
          style={{ paddingBottom: 10 }}
          name="closecircle"
          size={34}
          color="black"
        />
      </Pressable>

      <View
        style={{
          backgroundColor: "white",
          height: 500, // Increase height to accommodate new input
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        <Text
          style={{
            color: "black",
            textAlign: "center",
            paddingTop: 12,
            fontSize: 17,
            paddingBottom: 9,
            borderBottomColor: "#C0C0C0",
            borderBottomWidth: 0.8,
          }}
        >
          {VendorName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomColor: "#C0C0C0",
            borderBottomWidth: 0.8,
            padding: 10,
          }}
        >
          <MaterialIcons style={{}} name="timer" size={24} color="green" />
          <Text
            style={{
              color: "black",
              fontSize: 17,
              fontWeight: "600",
              marginLeft: 6,
            }}
          >
            Delivery in 2 hour 30 mins
          </Text>
        </View>
        <ScrollView>
          {cart.map((item, index) => (
            <FinalCheckout key={index} item={item} />
          ))}
          <View
            style={{
              borderBottomColor: "#D0D0D0",
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              borderBottomColor: "#D0D0D0",
              borderBottomWidth: 3,
            }}
          />
        </ScrollView>

        {/* Grand Total Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 14,
            padding: 10,
            shadowColor: "#686868",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: "#42E100", // Updated color
              fontWeight: "bold",
              paddingBottom: 3,
              fontSize: 17,
            }}
          >
            Grand Total
          </Text>
          <Text style={{ color: "#42E100", fontSize: 17, fontWeight: "600" }}>
            {"₹"}{total}
          </Text>
        </View>

        <TouchableOpacity
          onPress={confirmAddress}
          style={{
            backgroundColor: "#42E100", // Updated color
            padding: 10,
            alignItems: "center",
          }}
          activeOpacity={0.9}
        >

          
          <Text style={{ color: "white", fontSize: 17, fontWeight: "700" }}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <>
      <Modal animationType="slide" visible={modal} transparent={true} onRequestClose={() => setModal(false)}>
        <TouchableWithoutFeedback onPress={() => setModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.header}>{VendorName}</Text>
                <FlatList
                  data={cart}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <FinalCheckout item={item} />}
                />

                <View style={{ marginTop: 20 }}>
                  <Text style={styles.label}>Select Delivery Date:</Text>
                  <RNPickerSelect
                    onValueChange={(value) => setSelectedDate(value)}
                    items={dates}
                    value={selectedDate}
                    style={{ inputIOS: styles.picker, inputAndroid: styles.picker }}
                  />
                </View>

                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>Grand Total</Text>
                  <Text style={styles.totalText}>₹{total}</Text>
                </View>

                <TouchableOpacity onPress={confirmAddress} style={styles.placeOrderButton} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Place Order</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {total > 0 && (
        <Pressable style={styles.viewCartButton} onPress={() => setModal(true)}>
          <Text style={styles.buttonText}>View Cart • ₹{total}</Text>
        </Pressable>
      )}
    </>
  );
};

export default ViewCart;

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    width: "90%", 
    backgroundColor: "white", 
    padding: 20, 
    borderRadius: 10 
  },
  header: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 10 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  picker: { 
    fontSize: 16, 
    padding: 10, 
    backgroundColor: "#f0f0f0", 
    borderRadius: 5, 
    textAlign: "center" 
  },
  addressContainer: { 
    padding: 10 
  },
  input: { 
    borderColor: "#ccc", 
    borderWidth: 1, 
    padding: 8, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  buttonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  confirmButton: { 
    backgroundColor: "#42E100", 
    padding: 10, 
    borderRadius: 5, 
    alignItems: "center", 
    flex: 1, 
    marginRight: 5 
  },
  mapButton: { 
    backgroundColor: "#34A853", 
    padding: 10, 
    borderRadius: 5, 
    alignItems: "center", 
    flex: 1, 
    marginLeft: 5 
  },
  totalContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingVertical: 14, 
    padding: 10 
  },
  totalText: { 
    color: "#42E100", 
    fontSize: 17, 
    fontWeight: "bold" 
  },
  placeOrderButton: { 
    backgroundColor: "#42E100", 
    padding: 10, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  viewCartButton: { 
    position: "absolute", 
    bottom: 10, 
    alignSelf: "center", 
    backgroundColor: "#42E100", 
    padding: 10, 
    borderRadius: 6, 
    width: 180 
  }
});

