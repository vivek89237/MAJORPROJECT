import React, { useState ,useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import MERA_THELA from "~/assets/MERA_THELA.jpeg"
import { app } from '../firebaseConfig';

import { useCustomer } from '~/provider/CustomerProvider';
import { getFirestore, doc, getDocs, updateDoc, addDoc, setDoc, collection, query, where } from "firebase/firestore";
const db = getFirestore(app);
const RateOrder = ({ route, navigation }) => {
  const { orderData } = route.params; 
  const {customerContact} = useCustomer({});
  const [loading, setLoading] = useState(false);
  
  const [rating, setRating] = useState({
    vendorRating: 0,
    items: {},
  });
  const [review, setReview] = useState('');
  
  // console.log(rating);
  // console.log(review);
  //console.log(orderData);
  
  const handleSubmit = async () => {

    if (rating.vendorRating === 0) {
      Alert.alert("Please rate the vendor before submitting.");
      return;
    }
    setLoading(true);

    try {
      const vendorsQuery = query(
             collection(db, 'vendors'),
             where('ContactNo', '==', orderData.vendorContactNo),
        );
     const querySnapshot = await getDocs(vendorsQuery);
     const vendorDoc = querySnapshot.docs[0]; // Get the first document
     const vendorRef = vendorDoc.ref; // Get the document reference
     const vendorData = vendorDoc.data();
     const newVendorRating=((vendorData.averageRating*vendorData.totalRatings)+rating.vendorRating)/(vendorData.totalRatings+1);
    
    
     await updateDoc(vendorRef, {
      averageRating: newVendorRating,
      totalRatings: vendorData.totalRatings + 1,
    });

    await addDoc(collection(db, "vendorRatings"), {
      vendorContactNo: vendorData.ContactNo, // Replace with authenticated user ID
      customerContactNo: customerContact, // Replace with authenticated user ID
      timestamp: new Date().toISOString(),
      review: review,
      Rating: rating.vendorRating,
      ratedItems: Object.entries(rating.items).map(([vegetable, value]) => ({
        vegetable,
        rating: value,
      })),
    });


    const ordersQuery = query(
      collection(db, 'orders'),
      where('orderId', '==', orderData.orderId),
    );
    const orderQuerySnap = await getDocs(ordersQuery);
    const orderDoc = orderQuerySnap.docs[0]; 
    const orderRef = orderDoc.ref; 
    await updateDoc(orderRef, { isRated: true });

    setLoading(false);
    navigation.goBack();
    }

    catch (error) {
      console.error('Error submitting rating:', error);
      setLoading(false);
    }

    
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rate Your Order</Text>

      <View style={styles.restaurantContainer}>
        <Image source={MERA_THELA} style={styles.vendorImage} />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{orderData.VendorName}</Text>
          <View style={styles.ratingContainer}>
            <AirbnbRating
              count={5}
              defaultRating={0}
              size={20}
              onFinishRating={(value) => setRating({ ...rating, vendorRating: value })}
              showRating={false}
            />
          </View>
        </View>
      </View>

      <Text style={styles.label}>Rate the Items:</Text>
      {orderData.items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <AirbnbRating
                count={5}
                defaultRating={0}
                size={20}
                onFinishRating={(value) =>
                  setRating({
                    ...rating,
                    items: { ...rating.items, [item.name]: value },
                  })
                }
                showRating={false}
              />
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.label}>Leave a Review:</Text>
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        placeholder="Write your review here..."
        value={review}
        onChangeText={setReview}
      />


      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  vendorImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end', // Align rating to the right
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
  },
  textInput: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#42E100',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RateOrder;
