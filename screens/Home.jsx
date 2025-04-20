import {StyleSheet, Text, View, TouchableOpacity, StatusBar, SafeAreaView, Image , ScrollView } from 'react-native';
import React from 'react';
import TapNavigation from '../components/TapNavigation';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import avatar from '../assets/user.png';
import offerImg from '../assets/Offer.png';
import offer2Img from '../assets/offer2.png';
import { useGetCustomerInfoQuery } from '../API/shared/Customer';
import SubCategories from '../components/home/SubCategories';
import Search from '../components/home/Search';
import Salons from '../components/home/Salons';

const Home = () => {
  const navigation = useNavigation();  
  const { data } = useGetCustomerInfoQuery();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
      {/* Header */}
      <View style={styles.mainSection}>
        <Image source={avatar} style={styles.avatar} />

        <Icon name="map-marker-outline" size={30} color="#435E58" />

        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>موقعك</Text>
          <Text style={styles.name}>{data?.data?.location || "يرجي الانتظار..."}</Text>
        </View>

        <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell-badge-outline" size={30} color="#222222" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <Search />

      {/* Offer Section */}
      <View style={styles.offerSection}>
        <Image source={offerImg} style={styles.offerImage} />
      </View>

      {/* SubCategories Section */}
      <SubCategories />

    {/* Salons With Highest Rating Section */}
    <Salons navigation={navigation} />

    {/* Offer 2 Section */}
    <View style={styles.offerSection}>
    <Text style={styles.subCategoriesTitle}>افضل العروض</Text>
        <Image source={offer2Img} style={styles.offerImage} />
    </View>
      </ScrollView>

      {/* Navigation Tabs */}
      <TapNavigation navigation={navigation} />
    </SafeAreaView>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#fff',direction: 'rtl',},

  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 10,
    direction: 'rtl',
  },

  avatar: {width: 60,height: 60,borderRadius: 35,marginLeft: 10,resizeMode: 'contain',},

  textContainer: {flex: 1,justifyContent: 'center',marginRight: 10,},

  greetingText: {fontSize: 16,color: '#555',fontFamily: 'AlmaraiRegular',},

  name: {fontSize: 14,color: '#333',fontFamily: 'AlmaraiBold',},

  iconWrapper: {
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 15,
    padding: 7,
  },

  offerSection: {alignItems: 'center',marginTop: 15,},

  offerImage: {height: 150,borderRadius: 15,resizeMode: 'contain',},
});
