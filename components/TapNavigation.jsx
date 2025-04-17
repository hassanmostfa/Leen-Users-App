import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigationState } from '@react-navigation/native';

// Reusable Tab Button Component
const TabButton = ({ name, icon, isActive, onPress }) => {
  return (
    <TouchableOpacity style={[styles.iconWrapper, isActive && styles.activeTab]} onPress={onPress}>
      <Text>
      <Icon name={icon} size={30} color={isActive ? '#435E58' : '#888888'} /> {/* Active: Green, Inactive: Gray */}
      </Text>
      <Text style={[styles.tabText, isActive && styles.activeText]}>{name}</Text>
    </TouchableOpacity>
  );
};

const TapNavigation = ({ navigation }) => {
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for Plus icon modal
  const [isBookingsModalVisible, setIsBookingsModalVisible] = useState(false); // State for Bookings modal


  // Links for the Bookings modal
  const bookingsModalLinks = [
    { icon: 'office-building', text: 'حجوزات المقر', onPress: () => navigation.navigate('StudioBookings') },
    { icon: 'home', text: 'حجوزات المنزل', onPress: () => navigation.navigate('HomeBookings') },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Navigation Tabs */}
        <TabButton
          name="الرئيسية"
          icon="home-variant"
          isActive={currentRoute === 'Home'}
          onPress={() => navigation.navigate('Home')}
        />

        {/* Bookings Tab */}
        <TouchableOpacity
          style={[styles.iconWrapper, currentRoute === 'Bookings' && styles.activeTab]}
          onPress={() => setIsBookingsModalVisible(true)} // Open Bookings modal on press
        >
          <Text>
          <Icon name="calendar-month" size={30} color={currentRoute === 'Bookings' ? '#435E58' : '#888888'} /> {/* Active: Green, Inactive: Gray */}
          </Text>
          <Text style={[styles.tabText, currentRoute === 'Bookings' && styles.activeText]}>حجوزاتي</Text>
        </TouchableOpacity>

        <TabButton
          name="الفيديوهات"
          icon="movie-play-outline"
          isActive={currentRoute === 'Reels'}
          onPress={() => navigation.navigate('Reels')}
        />

        {/* Chat Icon */}
        <TabButton
          name="الرسائل"
          icon="message-processing-outline"
          isActive={currentRoute === 'Sellers'}
          onPress={() => navigation.navigate('Sellers')}
        />

        <TabButton
          name="حسابي"
          icon="account-outline"
          isActive={currentRoute === 'Profile'}
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      {/* Bookings Modal */}
      <Modal
        visible={isBookingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsBookingsModalVisible(false)} // Close modal on back button press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsBookingsModalVisible(false)} // Close modal on press
            >
              <Text>
              <Icon name="close" size={24} color="#000" />
              </Text>
            </TouchableOpacity>

            {/* Bookings Modal Links */}
            {bookingsModalLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalLink}
                onPress={() => {
                  link.onPress(); // Navigate to the link's screen
                  setIsBookingsModalVisible(false); // Close modal after navigation
                }}
              >
                <View style={styles.iconBackground}>
                  <Text>
                  <Icon name={link.icon} size={24} color="#435E58" />
                  </Text>
                </View>
                <Text style={styles.modalLinkText}>{link.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#ffffff', // White background
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    width: '100%',
    paddingHorizontal: 10,
    elevation: 8,
    direction: 'rtl', // RTL layout
    shadowColor: '#000', // Shadow at the top
    shadowOffset: { width: 0, height: -2 }, // Shadow at the top
    shadowOpacity: 0.1, // Shadow at the top
    shadowRadius: 4, // Shadow at the top
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTab: {
    color: '#435E58', // Green color for active tab
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#888888', // Gray color for inactive text
    fontFamily: 'AlmaraiRegular',
  },
  activeText: {
    color: '#435E58', // Green color for active text
  },
  plusIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 15,
  },
  plusIconBackground: {
    backgroundColor: '#435E58', // Green background
    borderRadius: 10, // Circular shape
    padding: 7, // Padding for the icon
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    direction: 'rtl',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Space between links
  },
  iconBackground: {
    backgroundColor: '#DFE8E5', // Light green background
    borderRadius: 50, // Circular shape
    padding: 10, // Padding for the icon
    marginLeft: 10, // Space between icon and text
  },
  modalLinkText: {
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    marginLeft: 10, // Space between icon and text
  },
});

export default TapNavigation;