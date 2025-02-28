import Mapbox, { MapView, Camera, LocationPuck } from '@rnmapbox/maps'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import ShowOrder from './ShowOrder'
import LineRoute from './LineRoute'
import { featureCollection, point } from '@turf/helpers'
import { useOrder } from './OrderProvider'
import SelectedOrderSheet from './SelectedOrderSheet'
import { getOrders } from './firebase'

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '')

const VendorMap = () => {
    
    const { selectedOrder, setSelectedOrder, directionCoordinate } = useOrder();
    const [orders, setOrders] = useState([]);
         
    const points = orders?.map(order => point([order.customerCoordinates[0], order.customerCoordinates[1]], { order }));
    
    const ordersFeatures = featureCollection(points);
  
    const onPointPress = (event) => {
      //console.log("pressed")
      if (event.features[0]?.properties?.order) {
        //console.log("pressed", event.features[0]?.properties?.order)
        setSelectedOrder(event.features[0]?.properties?.order);
      }
    };
  
  
    useEffect(() => {
      getOrders(8349755538, setOrders);
    }, []);
    //console.log(directionCoordinate)
    return (
      <View style={styles.container}>
        {/* Map View */}
        {/* styleURL="mapbox://styles/mapbox/dark-v11" */}
        <MapView style={styles.map} >
          <Camera followZoomLevel={10} followUserLocation />
          <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
  
          <ShowOrder onPointPress={onPointPress} ordersFeatures={ordersFeatures} />
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
    button: {
      marginTop: 20,
      padding: 10,
    },
  });
  
  export default VendorMap;
  