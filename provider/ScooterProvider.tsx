import {PropsWithChildren, createContext, useContext, useState, useEffect} from 'react'
import * as Location from 'expo-location';
import { getDirections } from '~/services/directions';
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import { Alert } from 'react-native';


const ScooterContext = createContext({});




export default function ScooterProvider ({children} : PropsWithChildren) {
    const [direction, setDirection] = useState({});
    const [selectedScooter, setSelectedScooter] = useState({});
    const [isNearby, setIsNearby] = useState(false);
  
   

    useEffect(()=>{
      const fetchDircections = async ()=>{
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        let myLocation = await Location.getCurrentPositionAsync({});

        const newDirection = await getDirections(
          [myLocation.coords.longitude, myLocation.coords.latitude],
          [selectedScooter?.longitude, selectedScooter?.latitude]
        );
        setDirection(newDirection);
        if(newDirection?.routes?.[0]?.distance<2000) {
          setIsNearby(true);
        }
        //console.log(isNearby);
      };

      if(selectedScooter) {
        fetchDircections();
      }
    }, [selectedScooter])

    // useEffect(() => {
    //   let subscription: Location.LocationSubscription | undefined;
  
    //   const watchLocation = async () => {
    //     subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
    //       const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
    //       const to = point([selectedScooter.longitude, selectedScooter.latitude]);
    //       const distance = getDistance(from, to, { units: 'meters' });
    //       if (distance < 2000) {
    //         setIsNearby(true);
    //       }
    //     });
    //   };
  
    //   if (selectedScooter) {
    //     watchLocation();
    //   }
  
    //   // unsubscribe
    //   return () => {
    //     subscription?.remove();
    //   };
    // }, [selectedScooter]);

    return (
    <ScooterContext.Provider value ={{
      selectedScooter, 
      setSelectedScooter, 
      direction, 
      directionCoordinate: direction?.routes?.[0]?.geometry?.coordinates,
      routeTime: direction?.routes?.[0]?.duration,
      routeDistance: direction?.routes?.[0]?.distance,
      isNearby
      }}>
        {children}
    </ScooterContext.Provider>
  )
}

export const useScooter = () => useContext(ScooterContext);