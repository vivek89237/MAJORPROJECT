import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import MERA_THELA from "~/assets/MERA_THELA.jpeg"
const RateOrder = ({ route, navigation }) => {
  const { orderData } = route.params; 

  const [rating, setRating] = useState({
    restaurant: 0,
    items: {},
  });
  const [review, setReview] = useState('');

  const handleSubmit = () => {

    // console.log('Restaurant Rating:', rating.restaurant);
    // console.log('Item Ratings:', rating.items);
    // console.log('Review:', review);

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rate Your Order</Text>

      <View style={styles.restaurantContainer}>
        <Image source={MERA_THELA} style={styles.restaurantImage} />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{orderData.VendorName}</Text>
          <View style={styles.ratingContainer}>
            <AirbnbRating
              count={5}
              defaultRating={0}
              size={20}
              onFinishRating={(value) => setRating({ ...rating, restaurant: value })}
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

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
  restaurantImage: {
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
