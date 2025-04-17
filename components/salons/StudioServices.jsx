import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetStudioServicesQuery } from '../../API/Services';

const StudioServices = ({ seller_id, navigation }) => { // Add navigation to props
  const { data, isLoading, error } = useGetStudioServicesQuery(seller_id) || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null); // Track the selected service object

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const filteredServices = data.studioServices.filter(service =>
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
          placeholder="ابحثي عن خدمات المقر..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon name="magnify" size={25} color="#555" style={styles.searchIcon} />
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* List of Services */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => navigation.navigate('CompleteBooking', { selectedService , service_type: 'studio' })}
        >
          <Text style={styles.completeButtonText}>استمرار</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StudioServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    position: 'relative', // Ensure the button is positioned relative to this container
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
  completeButton: {
    position: 'absolute', // Position the button absolutely
    bottom: 20, // Place it 20 units from the bottom
    left: 16, // Place it 16 units from the left
    right: 16, // Place it 16 units from the right
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