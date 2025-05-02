import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatImg from '../../assets/images/avatars/chat.png';
import moment from 'moment';
import Pusher from 'pusher-js/react-native';

const ChatRoom = ({ route, navigation }) => {
  const { chatRoomId, seller } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const pusherRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(
        `https://leen-app.com/public/api/customer/chat/messages/${chatRoomId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data?.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    }
  };

  useEffect(() => {
    const setupPusher = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) return;

        pusherRef.current = new Pusher('02c14683a1bbc058e455', {
          cluster: 'eu',
          authEndpoint: 'https://leen-app.com/public/api/broadcasting/auth/customer',
          auth: { headers: { Authorization: `Bearer ${authToken}` } },
        });

        const channel = pusherRef.current.subscribe(`private-chat-room.${chatRoomId}`);

        channel.bind('new-message', (data) => {
          console.log('New message data:', data);
          
          // Ensure we have the message in the correct format
          const newMsg = {
            id: data.id || data.message?.id,
            message: data.message?.message || data.message,
            sender_type: data.sender_type || data.message?.sender_type,
            created_at: data.created_at || data.message?.created_at,
            // Add other required fields
          };

          setMessages(prev => [...prev, newMsg]);
          
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        });

      } catch (error) {
        console.error('Pusher error:', error);
      }
    };

    fetchMessages();
    setupPusher();

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      await axios.post(
        'https://leen-app.com/public/api/customer/chat/sendMessage',
        {
          chat_room_id: chatRoomId,
          message: newMessage,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }) => {
    console.log('Rendering message item:', item); // Debug log
    
    const isCustomer = item.sender_type === "App\\Models\\Customers\\Customer";
    const messageText = item.message || item.message?.message || '';

    return (
      <View style={[
        styles.messageContainer,
        isCustomer ? styles.customerMessage : styles.sellerMessage
      ]}>
        <Text style={isCustomer ? styles.customerText : styles.sellerText}>
          {messageText}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-right" size={26} color="#000" />
        </TouchableOpacity>
        <Image 
          source={seller.seller_logo ? { uri: seller.seller_logo } : ChatImg} 
          style={styles.profileImage} 
        />
        <Text style={styles.headerTitle}>
          {seller.first_name} {seller.last_name}
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب رسالة..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send" size={24} color="#56766F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
    direction: 'rtl',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  customerMessage: {
    backgroundColor: '#435E58',
    alignSelf: 'flex-end',
  },
  sellerMessage: {
    backgroundColor: '#EAECF4',
    alignSelf: 'flex-start',
  },
  customerText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  sellerText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e7e7e7',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F5F6F7',
    fontFamily: 'AlmaraiRegular',
    marginRight: 10,
  },
});

export default ChatRoom;