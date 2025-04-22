import BottomSheet, { BottomSheetView, ANIMATION_CONFIGS } from '@gorhom/bottom-sheet';
import { ReduceMotion } from 'react-native-reanimated';
import { Text, Image, View } from 'react-native';
import { Button } from './Button';
import { useEffect, useRef } from 'react';
import { useScooter } from "~/provider/ScooterProvider";
import MERA_THELA from "~/assets/MERA_THELA.jpeg"
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SelectedScooterSheet() {
    const navigation = useNavigation();
    const { selectedScooter, isNearby, routeTime, routeDistance , setIsNearby} = useScooter();

    const bottomSheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        if (selectedScooter) {
            bottomSheetRef.current?.expand();
        }
    },[selectedScooter])  
    return (
        <>
             <BottomSheet
                animationConfigs={{ ...ANIMATION_CONFIGS, reduceMotion: ReduceMotion.Never }}
                ref={bottomSheetRef}
                index={-1}
                snapPoints={[200]}
                enablePanDownToClose
                backgroundStyle={{ backgroundColor: "#414442" }}
            >
                <BottomSheetView style={{ flex: 1, padding: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Image source={MERA_THELA} style={{ width: 60, height: 60 }} />
                        <View style={{ flex: 1, gap: 5 }}>
                            <Text style={{ color: "white", fontSize: 20, fontWeight: '600' }} >{selectedScooter?.name}</Text>
                            <Text style={{ color: "gray", fontSize: 15 }} >{selectedScooter?.id}</Text>
                        </View>
                        <View style={{ gap: 8 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, alignSelf: 'flex-start' }}>
                                <FontAwesome6 name="bolt-lightning" size={24} color="#42E100" />
                                <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>{(routeDistance / 1000).toFixed(1)} Kms</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, alignSelf: 'flex-start' }}>
                                <FontAwesome6 name="clock" size={24} color="#42E100" />
                                <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>{Math.ceil(routeTime / 60)} mins</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, padding: 20 }}>
                        {isNearby ? 
                        <Button 
                        title='Order Now' 
                        style={{ backgroundColor: "#42E100" }} 
                        onPress={() => navigation.navigate('VegetableListVendor', {id:selectedScooter?.id, ContactNo: selectedScooter?.ContactNo, name: selectedScooter?.name, rating:selectedScooter?.averageRating, totalDelivery:selectedScooter?.totalDelivery})}
                        /> 
                        :
                         <Button 
                         title='Out of Service' 
                         style={{ backgroundColor: "#414442" }} 
                         />
                        }
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </>

    );
}