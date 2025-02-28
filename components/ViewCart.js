import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput
} from "react-native";
import React, { useContext, useState } from "react";
import { CartItems } from "../Context";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import FinalCheckout from "./FinalCheckout";
import { useNavigation } from "@react-navigation/native";
import uploadCartItems from "../uploadCartItems";
import MapScreen from "./MapScreen";
import {useCustomer} from "~/provider/CustomerProvider";


const ViewCart = (props) => {
  const { setAdditems } = useContext(CartItems);
  const {customerContact, customerCoordinates} = useCustomer();
  const navigation = useNavigation();
  const { cart, setCart } = useContext(CartItems);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   // State for delivery address

  const {customerAddress} = useCustomer();
  //console.log(customerAddress)
  const [deliveryAddress, setDeliveryAddress] = useState(customerAddress );
  const total = cart
    .map((item) => item.price * item.quantity)
    .reduce((prev, curr) => prev + curr, 0);

  const VendorName = props.VendorName;
  const ContactNo = props.ContactNo;

  const confirmAddress = async () => {
    setIsLoading(true); // Show loader when confirming address

    try {
      await uploadCartItems(cart, setCart, VendorName, total, navigation, ContactNo, deliveryAddress, customerContact, customerCoordinates);
      setCart([]);
      setAdditems(0);
      setModal(false);
    } finally {
      setIsLoading(false); // Hide loader after upload completes
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

        {/* Address Input Section */}
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
            Enter Delivery Address
          </Text>
          <TextInput
            style={{
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 8,
              borderRadius: 5,
              marginBottom: 10,
            }}
            placeholder="Enter address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              onPress={confirmAddress}
              style={{
                backgroundColor: "#42E100",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                flex: 1,
                marginRight: 5,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  "Confirm Address"
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openMap} // Open map when pressed
              style={{
                backgroundColor: "#34A853",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                flex: 1,
                marginLeft: 5,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                Open Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
      <Modal
        animationType="slide"
        visible={modal}
        transparent={true}
        onRequestClose={() => setModal(false)}
      >
        {checkOut()}
      </Modal>

      <View style={{ flex: 1, paddingTop: 80 }}>
        {total === 0 ? null : (
          <Pressable
            style={{
              position: "absolute",
              bottom: 30,
              left: 100,
              borderRadius: 6,
              backgroundColor: "#42E100",
            }}
            onPress={() => setModal(true)}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                textAlign: "center",
                padding: 10,
                width: 180,
              }}
            >
              View Cart • {"₹"}{total}
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );
};

export default ViewCart;
