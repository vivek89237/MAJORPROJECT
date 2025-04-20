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
  ActivityIndicator,
  Alert
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { CartItems } from "../provider/Context";
import FinalCheckout from "./FinalCheckout";
import { useNavigation } from "@react-navigation/native";
import uploadCartItems from "../uploadCartItems";
import { useCustomer } from "~/provider/CustomerProvider";
import { doc, getDocs, collection } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; 

const ViewCart = ({ VendorName, ContactNo, id }) => {
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

  const validateAndPlaceOrder = async () => {
    setIsLoading(true);
    const isScheduled = selectedDate !== dates[0].value;
  
    try {
      let exceededItems = [];
  
      // Step 1: Fetch all vendors
      const vendorsSnapshot = await getDocs(collection(firestore, "vendors"));
      const vendorDoc = vendorsSnapshot.docs.find(doc => doc.data().ContactNo === ContactNo);
  
      if (!vendorDoc) {
        Alert.alert("Error", "Vendor not found.");
        return;
      }
  
      const vendorData = vendorDoc.data();
      const vendorVegetables = vendorData.vegetables || [];
  
      // Step 2: Check quantities
      for (let item of cart) {
        const veg = vendorVegetables.find(v => v.id === item.id);
        if (!veg) continue;
  
        const availableQty = parseFloat(veg.quantity);
        const requestedQty = parseFloat(item.quantity);
        // console.log("available Qty ",availableQty);
        // console.log("requested Qty ",requestedQty);
        
        if (requestedQty > availableQty) {
          exceededItems.push({
            name: item.name,
            requested: requestedQty,
            available: availableQty,
          });
        }
      }
  
      // Step 3: Alert if any issues
      if (exceededItems.length > 0) {
        const errorMsg = exceededItems
          .map(item => `• ${item.name}: Requested ${item.requested}, Available ${item.available}`)
          .join("\n");
  
        Alert.alert("Quantity Limit Exceeded", `Please adjust quantities for:\n\n${errorMsg}`);
        return;
      }
  
      // All good, place the order
      await uploadCartItems(
        id,
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

                <TouchableOpacity onPress={validateAndPlaceOrder} style={styles.placeOrderButton} disabled={isLoading}>
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
