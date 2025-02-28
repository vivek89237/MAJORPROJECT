import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect } from 'react'
import * as Location from 'expo-location';


const UpdatesCoords = () => {
    useEffect(()=>{
        const fetchDircections = async ()=>{
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
  
          let myLocation = await Location.getCurrentPositionAsync({});

          let location = {
            longitude: myLocation.coords.longitude, 
            latitude: myLocation.coords.latitude
          }
        };
      }, [])
  return (
    <View>
      <Text>UpdatesCoords</Text>
    </View>
  )
}

export default UpdatesCoords

const styles = StyleSheet.create({})