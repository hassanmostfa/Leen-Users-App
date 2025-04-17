import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BookingCard = ({ item, navigation }) => {
  const handleShow = () => {
    navigation.navigate('ShowHomeService', { item });
  };


  return (
    <View style={[styles.card, { direction: 'rtl' }]}>  
      {item.discount > 0 && (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.percentage}% خصم</Text>
          </View>
        </View>
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>السعر : {item.price} ريال</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#f08b47" />
          <Text style={styles.ratingText}>
            {item.service_average_rating == 0 ? 'لا يوجد تقييم' : item.service_average_rating}
          </Text>
        </View>
        <Text style={styles.servicePrice}>نوع الحجز : {item.booking_status === 'immediate' ? 'فوري' : 'بموعد مسبق'}</Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShow}>
          <Icon name="eye" size={24} color="#2f3e3b" />
          <Text style={styles.actionText}>عرض</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('UpdateHomeService', { item })}>
          <Icon name="pencil" size={24} color="#f08b47" />
          <Text style={styles.actionText}>تعديل</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Icon name="delete" size={24} color="#dc3545" />
          <Text style={styles.actionText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
    padding: 10,
    position: 'relative',
    borderRightWidth: 7,
    borderRightColor: '#435E58',
  },
  badgeContainer: {
    position: 'absolute',
    top: '8%',
    left: '88%',
    transform: [{ translateX: -30 }, { translateY: -15 }],
  },
  badge: {
    backgroundColor: '#435E58',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
  },
  detailsContainer: {
    padding: 10,
  },
  serviceName: {
    fontSize: 17,
    fontFamily: 'AlmaraiBold',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
    fontFamily: 'AlmaraiRegular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'AlmaraiRegular',
  },
  actionContainer: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    padding: 10,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'AlmaraiRegular',
  },
});

export default BookingCard;