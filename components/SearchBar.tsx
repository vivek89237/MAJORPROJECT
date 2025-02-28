import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const data = [
    'Apple', 'Banana', 'Carrot', 'Dates', 'Eggplant', 
    
  ];

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = data.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      {searchQuery.length> 0 && <FlatList
        data={filteredData.length > 0 ? filteredData : data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>{item}</Text>
        )}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  searchbar: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  itemText: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default App;
