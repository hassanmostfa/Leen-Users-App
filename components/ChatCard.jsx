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
import ChatImg from '../assets/images/avatars/chat.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const ChatCard = ({ item, navigation }) => {
  const handleChatRoomNavigation = async (clientId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(
        `https://leen-app.com/public/api/customer/chat/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data) {
        const chatRoomId = response.data.data.id; // Assuming the API returns `chatRoomId`
        const seller = response.data.data.seller;
        navigation.navigate('ChatRoom', { chatRoomId, seller });
      } else {
        Alert.alert('Error', 'Unable to create or resume the chat room.');
      }
    } catch (error) {
      console.error('Error creating or resuming chat room:', error);
      Alert.alert('Error', 'An unexpected error occurred' + error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.chatRoom}
        onPress={() => handleChatRoomNavigation(item.seller.id)}
      >
      <Image 
        source={item.seller.seller_logo ? { uri: item.seller.seller_logo } : ChatImg} 
        style={styles.profileImage} 
      />
        <View style={styles.chatInfo}>
          <Text style={styles.clientName}>
            {item.seller.first_name + ' ' + item.seller.last_name}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.latestMessage?.message || 'لا يوجد رسائل حالياً'}
          </Text>
        </View>
        <View style={styles.unreadCountContainer}>
          <Text style={styles.date}>
            {formatDateToArabic(item.latestMessage?.created_at)}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

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
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
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
    color: '#888',
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
});

export default ChatCard;
