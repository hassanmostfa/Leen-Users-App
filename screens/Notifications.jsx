import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationCard from '../components/notifications/NotificationCard';

const filterOptions = [
  { key: 'all', label: 'الكل' },
  { key: 'bookings', label: 'الحجوزات' },
  { key: 'payments', label: 'الدفعات المالية' },
  { key: 'ratings', label: 'التقييمات' },
];

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // Default: "الكل"

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Auth token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get('https://leen-app.com/public/api/customer/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching Notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((item) => {
    const matchesCategory =
      activeFilter === 'all' || item.category === activeFilter;
    return matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-right" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>الإشعارات</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        {filterOptions.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterButton, activeFilter === key && styles.activeFilter]}
            onPress={() => setActiveFilter(key)}
          >
            <Text style={[styles.filterText, activeFilter === key && styles.activeFilterText]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      {loading ? (
        <ActivityIndicator size="large" color="#435E58" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={({ item }) => <NotificationCard item={item} navigation={navigation} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.chatList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(246, 246, 246, 1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
    marginVertical: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
  activeFilter: {
    backgroundColor: '#435E58',
  },
  filterText: {
    fontSize: 15,
    fontFamily: 'AlmaraiBold',
    color: '#333',
  },
  activeFilterText: {
    color: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  chatList: {
    paddingBottom: 20,
  },
});

export default Notifications;
