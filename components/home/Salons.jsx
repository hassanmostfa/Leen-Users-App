import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, SafeAreaView, I18nManager, TouchableOpacity } from 'react-native';
import SalonImg from '../../assets/images/salon.jpg';
import { useGetSellersQuery } from '../../API/shared/Salons';
import { useGetAllFavouritesQuery } from '../../API/Favourites';
import { useAddToFavouritesMutation } from '../../API/Favourites';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const Salons = ({ navigation }) => {
  const { data, error, isLoading } = useGetSellersQuery();
  const { data: favouritesData } = useGetAllFavouritesQuery();
  const [addToFavourites] = useAddToFavouritesMutation();

  const handleAddFavourite = async (sellerId) => {
    try {
      await addToFavourites(sellerId).unwrap();
      Toast.show({
        type: 'success',
        text1: 'تم الاضافة للمفضلة',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
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

  // Extract sellers safely (fallback to empty array)
  const sellers = data?.sellers || [];
  
  // Check if item is in favourites safely
  const isFavourite = (sellerId) => {
    return favouritesData?.data?.some((favourite) => favourite.seller_id === sellerId);
  };

  return (
    <SafeAreaView>
      <View style={styles.salonSection}>
        <Text style={styles.salonTitle}>الاعلي تقييما</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2f3e3b" />
        ) : error ? (
          <Text style={styles.errorText}>حدث خطأ أثناء تحميل البيانات.</Text>
        ) : sellers.length === 0 ? (
          <Text style={styles.noSalonsText}>لا يوجد صالونات متاحة حالياً.</Text>
        ) : (
          <FlatList
            data={sellers}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row' }}
            style={{ direction: I18nManager.isRTL ? 'rtl' : 'ltr' }}
            renderItem={({ item }) => (
              <View style={styles.salonCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      item?.seller_logo
                        ? { uri: `https://leen-app.com/public/${item.seller_logo}` }
                        : SalonImg
                    }
                    style={styles.salonImage}
                  />
                  <View style={styles.heartIconContainer}>
                    {isFavourite(item.id) ? (
                      <Icon name="heart" size={24} color="#435E58" />
                    ) : (
                      <TouchableOpacity onPress={() => handleAddFavourite(item.id)}>
                        <Icon name="heart-outline" size={24} color="#435E58" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('ShowSellerInfo', { item })}>
                  <Text style={styles.salonName}>
                    {item?.first_name} {item?.last_name}
                  </Text>
                </TouchableOpacity>

                <View style={styles.salonInfoRow}>
                  <Text style={styles.salonSubCategories}>
                    {item?.service_subcategories?.length > 0
                      ? item.service_subcategories.join('، ') // Arabic comma
                      : 'لا توجد خدمات'}
                  </Text>
                  <Icon name="star" size={20} color="#F98600" />
                  <Text style={styles.salonRating}>
                    {item?.average_rating > 0 ? item.average_rating : 'لا يوجد تقييم'}
                  </Text>
                </View>

                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.salonLocation}>
                  {item?.location
                    ? item.location.length > 50
                      ? `${item.location.substring(0, 35)}...`
                      : item.location
                    : 'لا يوجد عنوان'}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Salons;

const styles = StyleSheet.create({
  salonSection: {
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 50,
  },
  salonTitle: {
    fontSize: 16,
    color: '#222222',
    fontFamily: 'AlmaraiBold',
    marginBottom: 15,
  },
  salonCard: {
    width: 290,
    marginHorizontal: 10,
    alignItems: 'right',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  imageContainer: {
    position: 'relative', // Allows positioning of the heart icon
  },
  salonImage: {
    width: "100%",
    height: 150,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  salonName: {
    fontSize: 16,
    color: '#222222',
    marginTop: 10,
    fontFamily: 'AlmaraiBold',
    textAlign: 'right',
  },
  salonInfoRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 5
  },
  salonSubCategories: {
    fontSize: 14,
    color: '#6D6D6D',
    fontFamily: 'AlmaraiRegular',
    flexShrink: 1 // Prevents overflow
  },
  salonRating: {
    fontSize: 14,
    color: '#6D6D6D',
    fontFamily: 'AlmaraiRegular',
    marginLeft: 5, // Adds spacing between subcategories and rating
  },
  salonLocation: {
    fontSize: 14,
    color: '#6D6D6D',
    marginTop: 5,
    fontFamily: 'AlmaraiRegular',
    textAlign: 'right',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noSalonsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});