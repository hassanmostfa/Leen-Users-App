import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, FlatList, I18nManager, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetAllFavouritesQuery } from '../API/Favourites';
import { useAddToFavouritesMutation } from '../API/Favourites';
import Toast from 'react-native-toast-message'; // Import Toast
import StudioServices from '../components/salons/StudioServices';
import HomeServices from '../components/salons/HomeServices';
import Employees from '../components/salons/Employees';
import Timetable from '../components/salons/Timetable';
import Ratings from '../components/salons/Ratings';
const ShowSellerInfo = ({ route, navigation }) => {
  const { item } = route.params;
  // Fetch favourites data
  const { data: favouritesData } = useGetAllFavouritesQuery() || [];
  const [addToFavourites] = useAddToFavouritesMutation();

  // State to manage the active link
  const [activeLink, setActiveLink] = useState(0); // Default is the first link

  // Dummy data for the links
  const LinkComponents = [
    { id: 0, name: 'خدمات المقر', component: <StudioServices seller_id={item.id} navigation={navigation} /> },
    { id: 1, name: 'خدمات المنزل', component: <HomeServices seller_id={item.id} navigation={navigation} /> },
    { id: 2, name: 'المختصين', component: <Employees seller_id={item.id} navigation={navigation} /> },
    { id: 3, name: 'مواعيد العمل', component: <Timetable seller_id={item.id} navigation={navigation} /> },
    { id: 4, name: 'التقييمات', component: <Ratings seller_id={item.id} navigation={navigation} /> },
  ];

  // Function to handle adding a seller to favourites
  const handleAddFavourite = async (sellerId) => {
    try {
      await addToFavourites(sellerId).unwrap();

      Toast.show({
        type: 'success',
        text1: 'تم الاضافة للمفضلة',
        position: 'top', // 'top' is more reliable than 'center'
        visibilityTime: 3000, // Shows for 3 seconds
        autoHide: true,
        topOffset: 50, // Adjust to make sure it's visible
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.data?.message || 'Failed to add to favourites',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  // Render each link item
  const renderLinkItem = ({ item: link }) => (
    <TouchableOpacity
      style={[
        styles.linkButton,
        activeLink === link.id && styles.activeLinkButton, // Apply green background for active link
      ]}
      onPress={() => setActiveLink(link.id)} // Set active link on press
    >
      <Text style={[styles.linkText, activeLink === link.id && styles.linkActiveText]}>{link.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Banner Image */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: `https://leen-app.com/public/${item.seller_banner}` }}
          style={styles.bannerImage}
        />

        {/* Back Icon */}
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-right" size={24} color="black" />
        </TouchableOpacity>

        {/* Heart Icon */}
        {favouritesData?.data?.some((favourite) => favourite.seller_id === item.id) ? (
          <Icon name="heart" size={24} color="#435E58" style={styles.heartIcon} /> // Filled heart for favourites
        ) : (
          <TouchableOpacity onPress={() => handleAddFavourite(item.id)} style={styles.heartIcon}>
            <Icon name="heart-outline" size={24} color="#435E58" /> 
          </TouchableOpacity>
        )}
      </View>

      {/* Seller Info Card */}
      <View style={styles.infoCard}>
        {/* Title and Rating in a row */}
        <View style={styles.titleRatingRow}>
          <Text style={styles.nameText}>{item.first_name + " " + item.last_name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{item.average_rating}</Text>
            <Icon name="star" size={20} color="#FFD700" />
          </View>
        </View>

        {/* Location below the row */}
        <View style={styles.locationRow}>
          <Icon name="map-marker-outline" size={20} color="#435E58" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        {/* Links Row */}
        <FlatList
          data={LinkComponents}
          renderItem={renderLinkItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          inverted // Invert the list to make it scroll from right to left
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row' }} // Keeps original order
          style={{ direction: I18nManager.isRTL ? 'rtl' : 'ltr' }} // Ensures correct direction
        />

        {/* Render the active component's content */}
        <View style={styles.componentContainer}>
          <View style={styles.scrollView}>
            {LinkComponents[activeLink].component}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShowSellerInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    direction: 'rtl',
  },
  bannerContainer: {
    width: '100%',
    height: '30%', // 30% of the screen height
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backIcon: {
    position: 'absolute',
    top: 40, // Adjust as needed
    right: 20, // Adjust as needed
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
  },
  heartIcon: {
    position: 'absolute',
    bottom: 30, // Adjust as needed
    left: 20, // Adjust as needed
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
  },
  infoCard: {
    position: 'absolute',
    top: '27%', // Adjust to overlap the banner
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    direction: 'rtl', // Ensure RTL layout for the entire card
    bottom: 0, // Ensure the card extends to the bottom of the screen
  },
  titleRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between title and rating
    alignItems: 'center', // Align items vertically in the center
    marginBottom: 8, // Space between the row and location
  },
  nameText: {
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align rating text and star icon
    gap: 5,
  },
  ratingText: {
    fontSize: 16,
    color: '#888888',
    marginRight: 5, // Space between rating text and star icon
  },
  locationRow: {
    flexDirection: 'row',
    gap: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#3D3D3D',
    fontFamily: 'AlmaraiRegular',
    marginBottom: 25,
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10, // Add padding to prevent links from touching the edges
  },
  linkButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    height: 45,
  },
  activeLinkButton: {
    backgroundColor: '#435E58', // Green background for active link
  },
  linkText: {
    fontSize: 14,
    color: '#435E58',
    fontFamily: 'AlmaraiBold',
  },
  linkActiveText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'AlmaraiBold',
  },
  componentContainer: {
    height: 400,
    borderRadius: 10,
  },
  scrollView: {
    flex: 1, // Ensure the ScrollView takes up all available space
  },
});