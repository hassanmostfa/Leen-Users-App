import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetHomeServicesQuery } from '../../API/Services';

const HomeServices = ({ seller_id, navigation }) => {
    const { data, isLoading, error } = useGetHomeServicesQuery(seller_id);
    const homeServices = data?.homeServices || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState(null); // Track the selected service object

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    const filteredServices = homeServices.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Toggle service selection (allow only one service to be selected)
    const toggleServiceSelection = (service) => {
        if (selectedService?.id === service.id) {
            // If the service is already selected, deselect it
            setSelectedService(null);
        } else {
            // Select the new service
            setSelectedService(service);
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="ابحثي عن خدمات المنزل..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Icon name="magnify" size={25} color="#555" style={styles.searchIcon} />
            </View>

            {/* Separator Line */}
            <View style={styles.separator} />

            {/* List of Services */}
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {filteredServices.map((service) => (
                    <View key={service.id} style={styles.card}>
                        {/* Service Name */}
                        <Text style={styles.serviceName}>{service.name}</Text>

                        {/* Price and Toggle Icon */}
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>{parseInt(service.price)} <Text>ريال</Text></Text>
                            <TouchableOpacity onPress={() => toggleServiceSelection(service)}>
                                <Icon
                                    name={selectedService?.id === service.id ? 'check-circle' : 'plus-circle-outline'}
                                    size={28}
                                    color={selectedService?.id === service.id ? '#435E58' : '#22222'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Complete Booking Button */}
            {selectedService && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.completeButton}
                        onPress={() => navigation.navigate('CompleteBooking', { selectedService , service_type: 'home'})}
                    >
                        <Text style={styles.completeButtonText}>استمرار</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default HomeServices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 20,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        fontFamily: 'AlmaraiRegular',
        color: '#333',
        textAlign: 'right',
    },
    searchIcon: {
        marginRight: 10,
    },
    scrollView: {
        flex: 1, // Take up remaining space
    },
    scrollViewContent: {
        paddingBottom: 20, // Add padding to avoid overlap with the button
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 16,
        backgroundColor: '#F6F6F6',
    },
    serviceName: {
        fontSize: 16,
        fontFamily: 'AlmaraiRegular',
        textAlign: 'right',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    price: {
        fontSize: 16,
        fontFamily: 'AlmaraiRegular',
        color: '#000',
        marginRight: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#E7E7E7',
        marginBottom: 20,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    completeButton: {
        backgroundColor: '#435E58',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    completeButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'AlmaraiRegular',
    },
});