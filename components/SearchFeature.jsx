import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import { getDirections } from '~/services/directions';
import { getVehicleInfo } from '~/utils/Firebase';
import MERA_THELA from '../assets/MERA_THELA.jpeg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

async function findDistance(vendors, setNewVendors) {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }

  let myLocation = await Location.getCurrentPositionAsync({});
  const updatedVendorCoordinates = [];

  for (let vendor of vendors) {
    let newdirection = await getDirections(
      [myLocation.coords.longitude, myLocation.coords.latitude],
      [vendor.longitude, vendor.latitude]
    );
    let dis = newdirection?.routes?.[0]?.distance;
    let dur = newdirection?.routes?.[0]?.duration;
    if (dis <= 20000) {
      updatedVendorCoordinates.push({
        name: vendor.name,
        ContactNo: vendor.ContactNo,
        profilePhoto: vendor.profilePhoto,
        longitude: vendor.longitude,
        latitude: vendor.latitude,
        distance: dis,
        duration: dur,
        vegetables: vendor.vegetables,
      });
    }
  }

  setNewVendors(updatedVendorCoordinates);
}

const SearchFeature = () => {
  const navigation = useNavigation();
  const [vendors, setVendors] = useState([]);
  const [newVendors, setNewVendors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [filterType, setFilterType] = useState(''); // State for filter type
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  useEffect(() => {
    getVehicleInfo(setVendors, [true]);
  }, []);

  useEffect(() => {
    if (vendors.length > 0) {
      findDistance(vendors, setNewVendors);
    }
  }, [vendors]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredVendors([]);
    } else {
      const filtered = newVendors
        .map((vendor) => {
          const vegetable = vendor.vegetables.find((veg) =>
            veg.name.toLowerCase().includes(searchText.toLowerCase())
          );
          if (vegetable) {
            return {
              name: vendor.name,
              ContactNo: vendor.ContactNo,
              profilePhoto: vendor.profilePhoto,
              distance: vendor.distance,
              duration: vendor.duration,
              vegetableName: vegetable.name,
              price: vegetable.price,
              unitType: vegetable.unit,
            };
          }
          return null;
        })
        .filter((vendor) => vendor !== null);
      setFilteredVendors(filtered);
    }
  }, [searchText, newVendors]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    let filtered = [...filteredVendors];
    if (type === 'price') {
      filtered = filtered.sort((a, b) => a.price - b.price); // Sorting by price
    } else if (type === 'time') {
      filtered = filtered.sort((a, b) => a.duration - b.duration); // Sorting by time (duration)
    }
    setFilteredVendors(filtered);
    setIsModalVisible(false); // Close modal after filtering
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a vegetable..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Filter Options */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Filter by:</Text>
                <TouchableOpacity style={styles.filterOption} onPress={() => handleFilter('price')}>
                  <Text style={styles.filterOptionText}>Price</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => handleFilter('time')}>
                  <Text style={styles.filterOptionText}>Time</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => `${item.name}-${item.vegetableName}`}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={MERA_THELA} style={styles.profilePhoto} />
            </View>

            <View style={styles.nameContainer}>
              <Text style={styles.vendorName}>{item.name}</Text>
            </View>

            <View style={styles.infoContainer}>
              {/* Highlighted Duration Row */}
              <View style={styles.infoRow}>
                <Icon name="clock-outline" size={18} color="#2196F3" style={styles.icon} />
                <Text style={styles.highlightedText}>{Math.round(item.duration / 60)} min</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="food-apple" size={18} color="#FF5722" style={styles.icon} />
                <Text style={styles.vegetableName}>{item.vegetableName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="map-marker-distance" size={18} color="#4CAF50" style={styles.icon} />
                <Text style={styles.infoText}>{Math.round(item.distance / 1000)} Km</Text>
              </View>

              {/* Highlighted Price Row */}
              <View style={styles.infoRow}>
                <Icon name="currency-inr" size={18} color="#FF9800" style={styles.icon} />
                <Text>{item.price} per {item.unitType}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => navigation.navigate('VegetableListVendor', { id, ContactNo: item.ContactNo, name: item.name })}
            >
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default SearchFeature;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 10,
    //backgroundColor: '#e0f7e0', // Light green background
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    flex: 1,
    borderRadius: 8,
  },
  filterButton: {
    backgroundColor: '#42E100',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  filterOption: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#42E100',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#B0BEC5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '45%',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  vendorName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 5,
  },
  vegetableName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555',
  },
  highlightedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  orderButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
