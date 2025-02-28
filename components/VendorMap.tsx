import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Mapbox, { MapView, Camera, LocationPuck } from '@rnmapbox/maps';
import { featureCollection, point } from "@turf/helpers";
import { useScooter } from '../provider/OrderProvider';
import LineRoute from './LineRoute';
import ShowVehicles from './ShowVehicles';
import { getOrders } from "../utils/Firebase";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import SelectedOrderSheet from './SelectedOrderSheet';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const VendorMap = () => {
  const navigation = useNavigation(); // Initialize navigation object
  const { setSelectedScooter, directionCoordinate } = useScooter();
  const [vendors, setVendor] = useState([]);
       
  const points = vendors?.map(scooter => point([scooter.customerCoordinates[0], scooter.customerCoordinates[1]], { scooter }));
  
  const scootersFeatures = featureCollection(points);

  const onPointPress = async (event) => {
    if (event.features[0]?.properties?.scooter) {
      setSelectedScooter(event.features[0].properties.scooter);
    }
  };


  useEffect(() => {
    getOrders(8349755538, setVendor);
  }, []);

  return (
    <View style={styles.container}>
      {/* Map View */}
      {/* styleURL="mapbox://styles/mapbox/dark-v11" */}
      <MapView style={styles.map} >
        <Camera followZoomLevel={10} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

        <ShowVehicles onPointPress={onPointPress} scootersFeatures={scootersFeatures} />
        {directionCoordinate && <LineRoute coordinates={directionCoordinate} />}
      </MapView>

      <SelectedOrderSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    backgroundColor: '#A0D683',
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 5,
  },
  filterIcon: {
    marginLeft: 10,
    backgroundColor: '#A0D683',
    padding: 5,
    borderRadius: 10,
    elevation: 5,
  },
  button: {
    marginTop: 20,
    padding: 10,
  },
  listContainer: {
    position: 'absolute',
    top: 100, 
    left: 10,
    right: 10,
    backgroundColor: 'white',
    maxHeight: 500, 
    zIndex: 1, 
    borderRadius: 10,
    elevation: 5,
  },
});

export default VendorMap;
