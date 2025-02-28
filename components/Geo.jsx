import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

const MapboxGeocoding = () => {
  const [coordinates, setCoordinates] = useState({});
  const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_KEY;  // Replace with your token

  const geocodeAddress = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodedAddress}&access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}`;
  
    try {
      const response = await fetch(url);  // Wait for the promise to resolve
      const data = await response.json(); // Parse the response as JSON
      //console.log(data)
      // Now access the 'features' array
      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates; // Access its coordinates (longitude, latitude)
        setCoordinates({latitude: coordinates[1], longitude: coordinates[0]});
      } else {
        console.log('No results found.');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
    }
  };
  
console.log(coordinates)
  return (
    <View style={{paddingTop:50}}>
      <Button title="Get Coordinates" onPress={() => geocodeAddress('213 B Dhiraj Nagar Indore India')} />
      {coordinates && (
        <Text>Coordinates: {coordinates[1]}, {coordinates[0]}</Text>  // Display latitude, longitude
      )}
    </View>
  );
};

export default MapboxGeocoding;
