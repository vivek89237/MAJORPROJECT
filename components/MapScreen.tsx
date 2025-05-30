import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ToastAndroid, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { updateLocation } from '~/utils/Supabase';
import { useCustomer } from '~/provider/CustomerProvider';
import { ActivityIndicator } from 'react-native';

const MapScreen = () => {
  const [query, setQuery] = useState('');
  const { customerId, refreshCustomer } = useCustomer();
  const [initialCoordinates, setInitialCoordinates] = useState(null);
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const webviewRef = useRef(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [houseInfo, setHouseInfo] = useState('');
  const [apartmentInfo, setApartmentInfo] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSearch = () => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        searchLocation('${query}');
      `);
    }
  };

  const handleConfirm = () => {
    setModalVisible(true);
  };

  const submitFinalAddress = async () => {
    setIsLoading(true);
    const finalAddress = `${houseInfo}, ${apartmentInfo}, ${query === '' ? currentAddress : query}`;

    await updateLocation(
      customerId,
      markerCoordinates?.latitude ?? initialCoordinates.latitude,
      markerCoordinates?.longitude ?? initialCoordinates.longitude,
      finalAddress
    );

    await refreshCustomer(); 

    ToastAndroid.show('Location Updated!', ToastAndroid.SHORT);
    
    setIsLoading(false);
    setModalVisible(false);
    navigation.goBack();
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
            if (locationData?.address) setCurrentAddress(locationData.address);
            if (locationData?.lat && locationData?.lng) {
              setMarkerCoordinates({
                latitude: locationData.lat,
                longitude: locationData.lng,
              });
            }
          }}
          style={{ flex: 1 }}
        />
      )}

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

      <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
        <Text style={styles.buttonText}>Confirm Address</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Address Details</Text>

            <TextInput
              placeholder="House/Flat/Block No"
              value={houseInfo}
              onChangeText={setHouseInfo}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Apartment/Area/Colony"
              value={apartmentInfo}
              onChangeText={setApartmentInfo}
              style={styles.modalInput}
            />

            {isLoading ? (
              <ActivityIndicator size="large" color="#42E100" />
            ) : (
              <View style={styles.modalButtonRow}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#ccc' }]}>
                  <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={submitFinalAddress} style={styles.modalButton}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

              </View>
            )}

          </View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#42E100',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  
});

export default MapScreen;
