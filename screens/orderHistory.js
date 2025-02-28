import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Card, Avatar, Button } from 'react-native-paper';
import { getFirestore, collection, getDocs, where } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useCustomer } from '~/provider/CustomerProvider';
const db = getFirestore(app);

const OrderHistory = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const {customerContact} = useCustomer({});
  // Fetch orders from Firebase
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'), where('customerContact', '==', customerContact) );
      const fetchedOrders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          VendorName: data.VendorName,
          date: data.date,
          items: data.cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,

          })),
          total: data?.total,
          status: data?.status,
          deliveryAddress: data.location,

        };
      });
      //console.log(customerContact)
      const filteredOrders = fetchedOrders.filter(order => order?.status === 'Delivered' || order?.status === 'Cancelled');
      setOrders(filteredOrders);
      // setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders: ", error);
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
              {orderItem.quantity}x {orderItem.name}
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
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('RateOrder', { orderData: item })}
          style={styles.button}
        >
          Rate Order
        </Button>
        <Button
          mode="contained"
          onPress={() => console.log(`Reorder ${item.id}`)}
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
