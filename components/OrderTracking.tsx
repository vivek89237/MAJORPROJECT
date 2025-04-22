import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Mapbox, { MapView, Camera, LocationPuck,ShapeSource, SymbolLayer, CircleLayer , Images, PointAnnotation } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { featureCollection, point } from "@turf/helpers";
import LineRoute from './LineRoute';
import {getVendorCoordinates} from '../utils/Firebase';
import { getDirections, getCoordinates } from '~/services/directions';
import pin from "~/assets/pin.png";
import customerLogo from "~/assets/customerLogo.png"
import Marker from "~/assets/marker.png"
import OrderTrackingSheet from "../components/OrderTrackingSheet" 

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');


export enum VehicleType{
  HANDCART='HANDCART',
  VEHICLE='VEHICLE'
}

export enum Way{
  WALKING='walking',
  DRIVING='driving'
}

export function vehicleType(type:any){
  switch (type){
    case VehicleType.HANDCART:
      return Way.WALKING
    case VehicleType.VEHICLE:
      return Way.DRIVING
    default :
      return Way.WALKING
  }
    
}

const OrderTracking = ({route}: {route:any}) => {
 
  const {vendorContactNo, vendorName, customerCoordinates} = route.params;  
  const [direction, setDirection] = useState({});
  const [vendorCoordinates, setVendorCoordinates] = useState({});

  useEffect(()=>{
    getVendorCoordinates(vendorContactNo, setVendorCoordinates);
  }, [])
  useEffect(()=>{
    
    const fetchDircections = async ()=>{
      const newDirection = await getDirections([customerCoordinates[1], customerCoordinates[0]], vendorCoordinates?.coordinates, vehicleType(vendorCoordinates?.type));
      setDirection(newDirection);
    };
  
    fetchDircections();
    
  },[])
 
  return (
    <View style={styles.container}>
      {/* Map View */}

      <MapView style={styles.map} styleURL="mapbox://styles/mapbox/light-v11">


        <Camera followZoomLevel={15} followUserLocation />
        {/* <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} /> */}

        <PointAnnotation
          id="marker1"
          coordinate={[customerCoordinates[1], customerCoordinates[0]]}
        >
          {/* Customize the marker */}
          <View style={{
            height: 30,
            width: 30,
            backgroundColor: 'green',
            borderRadius: 15,
            borderColor: 'white',
            borderWidth: 2,
          }} />
          {/* <Images images={{pin}}  /> */}
        
        </PointAnnotation>

        <ShapeSource 
          id="scooters" 
          cluster
          shape={featureCollection([point(vendorCoordinates)])} 
        >
          <SymbolLayer 
            id="scooter-icons"
            filter={['!' ,['has', 'point_count']]} 
            style={{
              iconImage: 'pin',
              iconSize : 0.3,
              iconAllowOverlap: true,
              iconAnchor : 'bottom'
            }} 
          />
          <Images images={{pin}}  />
        </ShapeSource>
        <LineRoute coordinates={direction?.routes?.[0]?.geometry?.coordinates} />
      </MapView>

      <OrderTrackingSheet 
        vendorName={vendorName} 
        routeTime={ direction?.routes?.[0]?.duration} 
        routeDistance={direction?.routes?.[0]?.distance} 
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default OrderTracking;
