// OrderConfirmation.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const OrderConfirmation = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Track Orders');
        }, 3000); // Redirect after 3 seconds


        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Ionicons name="checkmark-circle" size={30} color="green" />
            <Text style={styles.title}>Your Order Has Been Placed!</Text>
            <Text style={styles.message}>You will be redirected shortly...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 18,
        marginTop: 10,
    },
});

export default OrderConfirmation;
