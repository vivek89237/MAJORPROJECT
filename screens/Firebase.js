import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Import Firestore from React Native Firebase

export default function HomeScreen() {

  useEffect(() => {
    const getData = async () => {
      try {
        // Reference to the document in the "users" collection
        const docRef = firestore().collection('users').doc('CrwHC6ciF35Zd4fTAbqL');
        
        // Get the document
        const docSnap = await docRef.get();
        
        console.log("Fetching document...");
        if (docSnap.exists) {
          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    getData();
  }, []);

  console.log("Component rendering");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to this Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
