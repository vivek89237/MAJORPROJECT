// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from '~/components/Map';
import VendorMap from '~/components/VendorMap';
import ScooterProvider from '~/provider/ScooterProvider';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ScooterProvider>

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Map"
          component={Map}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VendorMap"
          component={VendorMap}
          options={{ title: 'Vendor Map' }}
        />

      </Stack.Navigator>
    </ScooterProvider>

  );
}
