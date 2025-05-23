import BottomSheet , {BottomSheetView } from '@gorhom/bottom-sheet';
import { Text , Image, View} from'react-native';
import { Button } from './Button';
import { useEffect, useRef, useState } from 'react';
import {useScooter} from "~/provider/ScooterProvider";
import MERA_THELA from "~/assets/MERA_THELA.jpeg"
import { FontAwesome6 } from '@expo/vector-icons';

export default function OrderTrackingSheet({vendorName, routeTime, routeDistance}){

    const bottomSheetRef = useRef<BottomSheet>(null);

    useEffect(()=>{
        bottomSheetRef.current?.expand();
    },[])
    //console.log(vendorName)
    // const onDelivered=()={
    //     // change status of order
    // }
    return (
    <View>
     <BottomSheet 
        ref={bottomSheetRef} 
        //index={-1} 
        snapPoints={[200]}  
        enablePanDownToClose
        backgroundStyle={{backgroundColor:"#414442"}}
        >
        <BottomSheetView style={{flex: 1, padding: 15}}>
        <View style={{flexDirection:"row", alignItems:"center",  gap:10}}>
            <Image source={MERA_THELA} style={{width: 60, height: 60}} />
            <View style={{flex:1, gap:5}}>
                <Text style={{color:"white", fontSize:20, fontWeight:'600'}} >{vendorName}</Text>
            </View>
            <View style={{gap:8}}>
                <View style ={{flexDirection:"row", alignItems:"center", gap: 5, alignSelf:'flex-start'}}>
                    <FontAwesome6 name="bolt-lightning" size={24} color="#42E100" />
                    <Text style={{color:"white", fontSize:18, fontWeight:'bold'}}>{(routeDistance/1000).toFixed(1)} Kms</Text>
                </View>
                <View style ={{flexDirection:"row", alignItems:"center", gap: 8, alignSelf:'flex-start'}}>
                    <FontAwesome6 name="clock" size={24} color="#42E100" />
                    <Text style={{color:"white", fontSize:18, fontWeight:'bold'}}>{Math.ceil(routeTime/60)} mins</Text>
                </View>
            </View>
        </View>

        <View style={{flex:1, padding:20}}>
            <Button 
            title='Cancel' 
            style={{backgroundColor:"red"}}
            //onPress={onDelivered}
            />
        </View>

        </BottomSheetView>
    </BottomSheet>
    </View>
   
    );
}