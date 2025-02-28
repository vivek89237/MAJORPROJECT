import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MapScreen = () => {
  const [query, setQuery] = useState('');
  
  // Function to handle location search and send it to the WebView
  const handleSearch = () => {
    webviewRef.current.injectJavaScript(`
      searchLocation('${query}');
    `);
  };

  const webviewRef = React.useRef(null);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: `
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
                center: [0, 0],
                zoom: 15
              });

              let marker = new mapboxgl.Marker({ draggable: true })
                .setLngLat([0, 0])
                .addTo(map);

              marker.on('dragend', () => {
                const lngLat = marker.getLngLat();
                window.ReactNativeWebView.postMessage(JSON.stringify({ lng: lngLat.lng, lat: lngLat.lat }));
              });

              // Function to search location and set marker
              async function searchLocation(query) {
                const response = await fetch(\https://api.mapbox.com/geocoding/v5/mapbox.places/\${query}.json?access_token=\${mapboxgl.accessToken}\);
                const data = await response.json();
                if (data.features.length) {
                  const [lng, lat] = data.features[0].geometry.coordinates;
                  map.flyTo({ center: [lng, lat], zoom: 15 });
                  marker.setLngLat([lng, lat]);
                }
              }
            </script>
          </body>
          </html>
        ` }}
        onMessage={(event) => {
          const location = JSON.parse(event.nativeEvent.data);
          console.log("New Location:", location);  // Logs the new location on drag
        }}
        style={{ flex: 1 }}
      />
      
      {/* Search Input */}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search location"
        style={styles.searchInput}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    zIndex: 1
  }
});

export default MapScreen;