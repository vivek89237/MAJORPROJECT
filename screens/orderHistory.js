import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Card, Avatar, Button } from 'react-native-paper';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useCustomer } from '~/provider/CustomerProvider';
const db = getFirestore(app);

const OrderHistory = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const { customerContact } = useCustomer({});
  console.log("no ", customerContact);


  const fetchOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('customerContact', '==', customerContact),
        where('status', 'in', ['Delivered', 'Cancelled'])
      );
      const querySnapshot = await getDocs(ordersQuery);
      const fetchedOrders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          VendorName: data.VendorName,
          vendorContactNo: data.vendorContactNo,
          date: data.date,
          items: data.cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unit: item?.unit,

          })),
          total: data?.total,
          status: data?.status,
          deliveryAddress: data.location,
          isRated: data.isRated,
          orderId: data.orderId,

        };
      });
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const fetchVendor = async (vendorContactNo) => {
    try {
      const ordersQuery = query(
        collection(db, 'vendors'),
        where('ContactNo', '==', vendorContactNo)
      );
  
      const querySnapshot = await getDocs(ordersQuery);
      const fetchedVendor = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          VendorName: data.name,
          vendorContactNo: data.ContactNo,
          totalRatings: data.totalRatings,
          totalDelivery: data.totalDelivery,
        };
      });
  
      if (fetchedVendor.length > 0) {
        return fetchedVendor[0]; 
      } else {
        console.log("No vendor found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching vendor: ", error);
      return null;
    }
  };
  



  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.VendorName}
        subtitle={`Date: ${item.date}`}
        left={(props) => <Avatar.Icon {...props} icon="store" />}
      />
      <Card.Content>
        <ScrollView style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Order Items:</Text>
          {item.items.map((orderItem, index) => (
            <Text key={index} style={styles.itemText}>
              {(orderItem?.quantity<1) ? orderItem?.quantity*1000: orderItem?.quantity} x {orderItem?.unit || "Kg"} {orderItem?.name}
            </Text>
          ))}
        </ScrollView>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Total: {item.total}</Text>
          <Text style={[styles.detailText, { color: item.status === "Delivered" ? "green" : "red" },]}>Status: {item.status} </Text>

          <Text style={styles.detailText}>Delivery Address: {item.deliveryAddress}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        {item.status === 'Delivered' && item.isRated == false && (
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('RateOrder', { orderData: item })}
            style={styles.button}
          >
            Rate Order
          </Button>
        )}
        <Button
          mode="contained"
          onPress={async () => {
            try {
              const vendorData = await fetchVendor(item.vendorContactNo); 

              if (vendorData) {
                navigation.navigate('VegetableListVendor', {
                  id: vendorData.id,
                  ContactNo: vendorData.vendorContactNo,
                  name: vendorData.VendorName,
                  rating: vendorData.totalRatings,
                  totalDelivery: vendorData.totalDelivery
                });
              } else {
                console.error("Vendor data not found");
              }
            } catch (error) {
              console.error("Error fetching vendor details:", error);
            }
          }}
          style={styles.button}
        >
          Reorder
        </Button>

      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  itemsContainer: {
    maxHeight: 150,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  detailsContainer: {
    marginTop: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    marginHorizontal: 8,
    // backgroundColor: '#42E100',
  },
});

export default OrderHistory;