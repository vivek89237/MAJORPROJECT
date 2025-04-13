import React, { useContext } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Menu from "../components/Menu";
import { CartItems } from "../provider/Context";
// import menu from "../data/menuData";
import { Pressable } from "react-native";
import ViewCart from "../components/ViewCart";
import { useScooter } from "~/provider/ScooterProvider";
import { useEffect, useState } from 'react';
import { getPosts } from '../utils/Firebase';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get("window");

const VegetableListVendor = ({ route }) => {
  const navigation=useNavigation();
  const { cart, setCart, additems, setAdditems } = useContext(CartItems);
  // const {routeTime} = useScooter();
  const { menuData } = useContext(CartItems);
  const {id, ContactNo, name, rating, totalDelivery}=route.params;
  
  const latitude = 0;
  const longitude = 0;
  //setCart([]);
  const Onpress = () => {
    console.warn("button pressed");
  };

 
  const [data, setData] = useState([]);
  useEffect(()=>{
    getPosts(ContactNo,setData);
    setCart([]);
  }, [])
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}>
        <View
          style={{
            marginTop: 5,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            style={{
              paddingHorizontal: 10,
              width: 36,
              height: 36,
              marginLeft: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 18,
              backgroundColor: "#141E30",
              paddingLeft: 5,
            }}
          >
            <Ionicons
              onPress={() => navigation.goBack()}
              name="chevron-back-outline"
              style={{
                textAlign: "center",
                color: "white",
              }}
              size={26}
              color="white"
            />
          </Pressable>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 4,
            }}
          >
            <Ionicons
              style={{ paddingHorizontal: 5 }}
              name="bookmark-outline"
              size={24}
              color="black"
            />
            <MaterialCommunityIcons
              style={{ paddingHorizontal: 5 }}
              name="share-outline"
              size={24}
              color="black"
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.vehicle}>Cart</Text>
            {/* <Text style={styles.cartNo}>GCV328184</Text> */}
          </View>
          <Pressable style={styles.rightContainer}>
            <Pressable
              style={{
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#3CB371",
                padding: 4,
                paddingHorizontal: 10,
                marginHorizontal: 10,
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text
                style={{
                  marginHorizontal: 3,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {rating?.toFixed(1)}
              </Text>
              <Ionicons name="star" size={20} color="white" />
            </Pressable>
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#675DFF",
                paddingHorizontal: 10,
                marginHorizontal: 10,
                padding: 5,
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>{totalDelivery} Orders</Text>
            </View>
          </Pressable>
        </View>
        <View
          style={{
            padding: 3,
            marginLeft: 6,
            marginRight: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <MaterialCommunityIcons
              style={{
                backgroundColor: "#E0E0E0",
                borderRadius: 50,
                padding: 8,
              }}
              name="timer-outline"
              size={21}
              color="gray"
            />
            <View>
              <View>
                <Text style={{ marginLeft: 6, fontSize: 14, color: "#707070" }}>
                  TIME
                </Text>
              </View>
              <Text style={{ marginLeft: 6, fontSize: 13 }}>2 hours</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20, // Added space between views
            }}
          >


          </View>
        </View>

        <View style={{ marginLeft: 10, marginTop: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "700" }}>Vegetables List</Text>
          <Text
            style={{
              backgroundColor: "#675DFF",
              width: 74,
              height: 3,
              marginTop: 6,
            }}
          ></Text>
        </View>
        {/*  Menu Items */}
        {data?.map((item, index) => (
          <Menu
            cart={cart}
            setCart={setCart}
            key={index}
            menu={item}

            
          />
        ))}
        {/* {data &&
          <Menu
            cart={cart}
            setCart={setCart}
            //key={index}
            menu={data}

            
          />
        } */}

        {/* ViewCart is Visible */}
        <ViewCart
          VendorName={name}
          ContactNo={ContactNo}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VegetableListVendor;

const styles = StyleSheet.create({
  name: {
    marginHorizontal: 10,
    paddingBottom: 6,
    fontSize: 20,
    fontWeight: "700",
  },
  cartNo: {
    fontSize: 17,
    color: "gray",
    marginHorizontal: 10,
  },
  vehicle: {
    marginHorizontal: 10,
    paddingBottom: 6,
    fontSize: 17,
    color: "#303030",
  },
  rightContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
});
