import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const MapScreen = ({route}) => {
  const [query, setQuery] = useState('');
  const [initialCoordinates, setInitialCoordinates] = useState(null);
  const [markerCoordinates, setMarkerCoordinates] = useState(null); // New state for marker coordinates
  const webviewRef = useRef(null);
  const navigation = useNavigation();

  // Fetch the current location when the component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setInitialCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMarkerCoordinates(location?.coords);
    })();
  }, []);

  // Function to handle location search and send it to the WebView
  const handleSearch = () => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        searchLocation('${query}');
      `);
    }
  };

  const handleConfirm = () => {
    //console.log('Marker Coordinates:', markerCoordinates); // Log the marker coordinates
    navigation.goBack(); // Pass the address back
  };

  return (
    <View style={{ flex: 1 }}>
      {initialCoordinates && (
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{
            html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
              <style>
                body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
                #map { width: 100%; height: 100%; }
              </style>
              <script src='https://api.mapbox.com/mapbox-gl-js/v2.12.0/mapbox-gl.js'></script>
              <link href='https://api.mapbox.com/mapbox-gl-js/v2.12.0/mapbox-gl.css' rel='stylesheet' />
            </head>
            <body>
              <div id='map'></div>
              <script>
                mapboxgl.accessToken = 'pk.eyJ1IjoicGNob3VkaGFyeTI5IiwiYSI6ImNsenJ6amoxMjE5Z2kyanMzcG0xbzJtaWMifQ.cj9fDzOQMilkSLwUFO3MpQ';
                const map = new mapboxgl.Map({
                  container: 'map',
                  style: 'mapbox://styles/mapbox/streets-v11',
                  center: [${initialCoordinates.longitude}, ${initialCoordinates.latitude}],
                  zoom: 15
                });

                let marker = new mapboxgl.Marker({ draggable: true })
                  .setLngLat([${initialCoordinates.longitude}, ${initialCoordinates.latitude}])
                  .addTo(map);

                marker.on('dragend', () => {
                  const lngLat = marker.getLngLat();
                  window.ReactNativeWebView.postMessage(JSON.stringify({ lng: lngLat.lng, lat: lngLat.lat }));
                });

                // Function to search location and set marker
                async function searchLocation(query) {
                  const response = await fetch(\`https://api.mapbox.com/geocoding/v5/mapbox.places/\${query}.json?access_token=\${mapboxgl.accessToken}\`);
                  const data = await response.json();
                  if (data.features.length) {
                    const [lng, lat] = data.features[0].geometry.coordinates;
                    map.flyTo({ center: [lng, lat], zoom: 15 });
                    marker.setLngLat([lng, lat]);
                    window.ReactNativeWebView.postMessage(JSON.stringify({ address: data.features[0].place_name, lng: lng, lat: lat }));
                  }
                }
              </script>
            </body>
            </html>
          `
          }}
          onMessage={(event) => {
            const locationData = JSON.parse(event.nativeEvent.data);
            console.log(locationData);
            setMarkerCoordinates([locationData.lat, locationData.lng]);
          }}
          style={{ flex: 1 }}
        />
      )}

      {/* Search Input and Button */}
      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search location"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
        <Text style={styles.buttonText}>Confirm Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  searchButton: {
    backgroundColor: '#42E100',
    padding: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#42E100',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapScreen;
