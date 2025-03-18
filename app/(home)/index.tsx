import React from 'react';
import { Button } from '~/components/Button';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
//screens 
import VegetableListVendor from '../../screens/VegetableListVendor'; // Home screen
import CurrentOrder from '../../screens/currentOrder'; // Track Current Orders screen
import OrderHistory from '../../screens/orderHistory'; // Past Orders screen
import RateOrder from '../../screens/RateOrder';
import OrderConfirmation from '../../orderConfirmation';
import MapScreen from '~/components/MapScreen'; 
import Map from '~/components/Map';
import SearchFeature from '~/components/SearchFeature'
import OrderTracking from '~/components/OrderTracking';
import ProfileScreen from '~/ProfileLayout/ProfileScreen';
// icons
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconButton } from 'react-native-paper'; 
//import VendorMap from '~/components/VendorMap';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Track Orders') {
            iconName = focused ? 'time' : 'time-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Past Orders') {
            iconName = 'history';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          }else if (route.name === 'Settings'){
            iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#414442' }
      })}
    >
      <Tab.Screen name="Home" component={Map} options={{ headerShown: false }} />
      <Tab.Screen name="Track Orders" component={CurrentOrder} />
      <Tab.Screen name="Past Orders" component={OrderHistory} />
      <Tab.Screen name="Settings" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
        {/* Main Tab Navigator */}
        <Stack.Navigator >
        {/* <Stack.Navigator initialRouteName="Home"> */}
          {/* <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={Detail} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Fetch" component={Fetch} options={{ headerShown: false }} /> */}
          
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Map"
            component={Map}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="OrderHistory"
            component={OrderHistory}
            options={{ title: 'Order History' }}
          />

          <Stack.Screen
            name="VegetableListVendor"
            component={VegetableListVendor}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="OrderConfirmation"
            component={OrderConfirmation}
            options={{ headerLeft: null }}
          />

          <Stack.Screen
            name="Search"
            component={SearchFeature}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RateOrder"
            component={RateOrder}
            options={({ navigation }) => ({
              title: 'Rate your Order',
              headerLeft: () => (
                <IconButton
                  icon="arrow-left"
                  onPress={() => navigation.goBack()}
                />
              ),
            })}
          />

          <Stack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{ title: 'Set Location' }}
          />
          <Stack.Screen
            name="Ordertracking"
            component={OrderTracking}
            options={{ headerShown: false }}
          />

         
        </Stack.Navigator>
        </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});