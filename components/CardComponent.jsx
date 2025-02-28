import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MERA_THELA from "~/assets/MERA_THELA.jpeg";

const CardComponent = ({ name, id, ContactNo }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <Image source={MERA_THELA} style={styles.avatar} />
                <View style={styles.headerText}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.subtitle}>Phone: {ContactNo}</Text>
                </View>
            </View>

            {/* Card Actions */}
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.availableButton}>
                    <Text style={styles.availableText}>Available</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.orderButton}
                    onPress={() => navigation.navigate('VegetableListVendor', { ContactNo, name })}
                >
                    <Text style={styles.orderButtonText}>Order Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CardComponent;

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        margin: 10,
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#42E100',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
    },
    cardContent: {
        marginVertical: 10,
    },
    contactLabel: {
        fontSize: 12,
        color: '#777',
    },
    contactText: {
        fontSize: 14,
        color: '#333',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    availableButton: {
        borderColor: '#42E100',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    availableText: {
        color: '#42E100',
        fontWeight: 'bold',
    },
    orderButton: {
        backgroundColor: '#42E100',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    orderButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
