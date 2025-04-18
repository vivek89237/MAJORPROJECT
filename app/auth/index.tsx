import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,AppState } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {supabase} from "../../lib/supabase"
import * as Location from 'expo-location';

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  }
);

export default function Auth() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countryCode, setCountryCode] = useState('IN'); // Default to India
  const [callingCode, setCallingCode] = useState('91'); // Default calling code
  const [initialCoordinates, setInitialCoordinates] = useState({
    latitude:null,
    longitude:null
  });
  // Fetch the current location when the component mounts
    useEffect(() => {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({});
        setInitialCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      })();
    }, []);
  

  const sendOtp = async () => {
    if (!phoneNumber) {
      Toast.show({
        type: 'error', // 'success', 'error', or 'info'
        text1: 'Please enter a valid phone number.',
      });
      //Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    const fullPhoneNumber = `+${callingCode}${phoneNumber}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: fullPhoneNumber });
      if (error) {
        Toast.show({
          type: 'error', // 'success', 'error', or 'info'
          text1: 'Please enter the OTP.',
        });
        //Alert.alert('Error', error.message);
      } else {
        setIsOtpSent(true);
        Toast.show({
          type: 'success', // 'success', 'error', or 'info'
          text1: 'OTP has been sent to your phone.',
          visibilityTime: 3000
        });
        //Alert.alert('Success', 'OTP has been sent to your phone.');
      }
    } catch (err) {
      Toast.show({
        type: 'error', // 'success', 'error', or 'info'
        text1: 'An unexpected error occurred. Please try again later.',
      });
      //Alert.alert('Unexpected Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      Toast.show({
        type: 'error', // 'success', 'error', or 'info'
        text1: 'Please enter the OTP.',
      });//Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    const fullPhoneNumber = `+${callingCode}${phoneNumber}`;

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) {
        Toast.show({
          type: 'error', // 'success', 'error', or 'info'
          text1: error.message,
        });
        //Alert.alert('Error', error.message);
      } else {
        Toast.show({
          type: 'success', 
          text1: 'Logged in successfully!',
          visibilityTime: 3000
        });
        const user = {
          id:  data?.user?.id,
          Name: "Name",
          Address: "Address",
          ContactNo: phoneNumber,
          image: "https://zfcmfksnxyzfgrbhxsts.supabase.co/storage/v1/object/sign/userdummyimage/customerImage.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1c2VyZHVtbXlpbWFnZS9jdXN0b21lckltYWdlLndlYnAiLCJpYXQiOjE3NDIzMTgxNjYsImV4cCI6MTc3Mzg1NDE2Nn0.KcsjwoUZTWOxcw8M1Kvx-sV4bYMCnoyVvBWgYPUYLzA",
          latitude:initialCoordinates.latitude,
          longitude:initialCoordinates.longitude,
        }
       // console.log('User data:', data?.user?.id);
         const { error } = await supabase.from('User').upsert(user,{onConflict:'id', ignoreDuplicates:true});
         if (error) {
           console.error('Error inserting customer:', error);
         }
       }
    } catch (err) {
      Toast.show({
        type: 'error', // 'success', 'error', or 'info'
        text1: 'An unexpected error occurred. Please try again later.',
      });
      //Alert.alert('Unexpected Error', 'An unexpected error occurred. Please try again later.');
    }

    //console.log("otp is verified");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Login</Text>

      {!isOtpSent ? (
        <>
          <View style={styles.phoneInputContainer}>
            <CountryPicker
              withCallingCode
              withFlag
              withFilter
              withCountryNameButton
              countryCode={countryCode}
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
            />
            <Text style={styles.callingCode}>+{callingCode}</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={sendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.button} onPress={verifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  callingCode: {
    fontSize: 16,
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
