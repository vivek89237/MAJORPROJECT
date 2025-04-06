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

