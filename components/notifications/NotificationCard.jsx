import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const formatDateToArabic = (dateString) => {
  if (!dateString) return 'لا يوجد وقت متاح';

  const messageDate = new Date(dateString);
  const currentDate = new Date();
  const diffInTime = currentDate - messageDate;
  const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

  // If the date is today
  if (diffInDays === 0) {
    return 'اليوم';
  }
  // If the date is yesterday
  if (diffInDays === 1) {
    return 'الأمس';
  }
  // If the date is within the last 7 days
  if (diffInDays < 7) {
    const weekdayFormatter = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' });
    return weekdayFormatter.format(messageDate);
  }
  // For older dates, show numeric date
  const numericFormatter = new Intl.DateTimeFormat('ar-EG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return numericFormatter.format(messageDate);
};

const NotificationCard = ({item}) => {
  return (
<View>
      <TouchableOpacity style={styles.chatRoom}>
        {item.category === "bookings" ? (
        <Icon style={styles.icon} name="bell" size={30} color="#435E58" />
        ) : item.category === "payments" ? (
        <Icon style={styles.icon} name="currency-usd" size={30} color="#435E58" />
        ) : (
        <Icon style={styles.icon} name="star" size={30} color="#435E58" />
        )}

        <View style={styles.chatInfo}>
          <Text style={styles.clientName}>
            {item.title || 'لا يوجد عنوان حالياً'}
          </Text>
          <Text style={styles.lastMessage}>
            {item.content || 'لا يوجد رسائل حالياً'}
          </Text>
        </View>
        <View style={styles.unreadCountContainer}>
          <Text style={styles.date}>
            {formatDateToArabic(item.created_at)}
          </Text>
          {item.is_read === 0 && 
            <Icon name="circle" size={12} color="#435E58" />
          }
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default NotificationCard

const styles = StyleSheet.create({
    chatRoom: {
      direction: 'rtl',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(231, 231, 231, 1)',
    },
    chatInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    clientName: {
      fontSize: 16,
      fontFamily: 'AlmaraiBold',
      color: '#333',
    },
    lastMessage: {
      fontSize: 14,
      color: '#6D6D6D',
      marginTop: 4,
      fontFamily: 'AlmaraiRegular',
    },
    unreadCountContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    unreadBadge: {
      backgroundColor: '#435e58',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    unreadCount: {
      fontSize: 12,
      color: 'white',
      fontWeight: 'bold',
    },
    date: {
      fontSize: 12,
      color: '#666',
      marginBottom: 5,
      fontFamily: 'AlmaraiRegular',
    },
    icon: {
        backgroundColor: '#DFE8E5',
        borderRadius: 50,
        padding: 10,
      },
  });
  