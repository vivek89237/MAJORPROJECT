import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, Modal, Button, TouchableOpacity } from 'react-native';
import { List, Divider, Avatar } from 'react-native-paper';
import customerLogo from "../assets/customerLogo.png";
import { supabase } from '~/lib/supabase';
import { useCustomer } from '~/provider/CustomerProvider';
import MapScreen from '~/components/MapScreen';
import { useNavigation } from "@react-navigation/native";
export default function ProfileScreen() {
  const navigation = useNavigation();
  const { customerImage, customerId, customerName, customerContact, customerAddress } = useCustomer();
  //console.log(customerContact)
  const [deliveryAddress, setDeliveryAddress] = useState(customerAddress);
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setModalVisible(false);

    try {
      let updateData = {};
      updateData[fieldToUpdate] = newValue;
      console.log("inside update",customerId);
      
      const { data, error } = await supabase
        .from('User') // Replace 'Customers' with your actual table name
        .update(updateData)
        .eq('id', customerId); // Replace with your condition

      if (error) {
        console.error('Error updating:', error.message);
        return;
      }
      setFieldToUpdate('');
      //console.log('Updated successfully:', data);
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  // const confirmAddress = async () => {
  //     setIsLoading(true); // Show loader when confirming address
  
  //     try {
  //       await uploadCartItems(cart, setCart, VendorName, total, navigation, ContactNo, deliveryAddress, customerContact, customerCoordinates);
  //       setModal(false);
  //     } finally {
  //       setIsLoading(false); // Hide loader after upload completes
  //     }
  //   };
  
    const openMap = () => {
      navigation.navigate("MapScreen"); // Navigate to map screen
    };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Avatar.Image size={72} source={{ uri: customerImage } || customerLogo} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{customerName}</Text>
        </View>
      </View>

      <Divider />

      {/* Settings Options */}
      <View style={styles.list}>
        <List.Section>
          <List.Item
            title={customerName}
            description="Update name"
            left={() => <List.Icon icon="account" />}
            onPress={() => {
              setNewValue(customerName);
              setFieldToUpdate('Name');
              setModalVisible(true);
            }}
          />
          <Divider />
          <List.Item
            title={customerContact}
            description="Update number"
            left={() => <List.Icon icon="phone" />}
            onPress={() => {
              setNewValue(customerContact + '');
              setFieldToUpdate('ContactNo');
              setModalVisible(true);
            }}
          />
          <Divider />
          <List.Item
            title={customerAddress}
            description="Update address"
            left={() => <List.Icon icon="map" />}
            onPress={() => {
              openMap();
            }}
          />
          {/* <TouchableOpacity
            onPress={} // Open map when pressed
            style={{
              backgroundColor: "#34A853",
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              flex: 1,
              margin: 10,
              width: 300,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              Open Map
            </Text>
          </TouchableOpacity> */}
          <Divider />
          <List.Item
            title="Logout"
            left={() => <List.Icon icon="logout" />}
            onPress={() => supabase.auth.signOut()}
          />
          <Divider />
        </List.Section>
      </View>


      {/* <View style={{ padding: 10 }}>
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
          
        </View>
      </View> */}


      {/* Update Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update {fieldToUpdate}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`Enter new ${fieldToUpdate}`}
              value={newValue}
              onChangeText={setNewValue}
              placeholderTextColor="#aaa"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.updateButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F1F1F',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  list: {
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#333',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
