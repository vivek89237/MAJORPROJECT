import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Mapbox, { MapView, Camera, LocationPuck, PointAnnotation } from '@rnmapbox/maps';
import { Searchbar } from 'react-native-paper';
import { featureCollection, point } from "@turf/helpers";
import { useScooter } from '../provider/ScooterProvider';
import LineRoute from './LineRoute';
import ShowVehicles from './ShowVehicles';
import { getVehicleInfo } from "../utils/Firebase";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import SelectedScooterSheet from './SelectedScooterSheet';
import CardComponent from "./CardComponent";
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon from react-native-vector-icons

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const Map = () => {
  const navigation = useNavigation(); // Initialize navigation object
  const { setSelectedScooter, directionCoordinate } = useScooter();
  const [vendors, setVendor] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  
  const filteredVendors = vendors.filter((vendor)=>{return vendor?.status === true})
  const points = filteredVendors?.map(scooter => point([scooter.longitude, scooter.latitude], { scooter }));
  
  const scootersFeatures = featureCollection(points);

  const onPointPress = async (event) => {
    if (event.features[0]?.properties?.scooter) {
      setSelectedScooter(event.features[0].properties.scooter);
    }
  };

  const onChangeSearch = (query:string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = vendors.filter(item =>
        item?.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    getVehicleInfo(setVendor, [true, false]);
  }, []);

  return (
    <View style={styles.container}>
      {/* styleURL="mapbox://styles/mapbox/dark-v11" */}
      <MapView style={styles.map} >
        <Camera followZoomLevel={10} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

        <ShowVehicles onPointPress={onPointPress} scootersFeatures={scootersFeatures} />
        {directionCoordinate && <LineRoute coordinates={directionCoordinate} />}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchbar}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Icon name="filter" size={30} color="#000" style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {searchQuery.length > 0 && (
        <FlatList
          style={styles.listContainer}
          data={filteredData.length > 0 ? filteredData : vendors}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{flex:1}}>
             <CardComponent name={item?.name} id={item?.id} ContactNo={item?.ContactNo} status={item?.status}/>
            </View>
          )}
        />
      )}
      <SelectedScooterSheet />
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

export default Map;
