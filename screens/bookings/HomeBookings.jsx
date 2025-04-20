import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetHomeBookingsQuery } from '../../API/shared/BookHomeService'
import CancelBookingModal from '../../components/bookings/CancelBookingModal';

const HomeBookings = ({ navigation }) => {
  const { data, isLoading, isError, error, refetch } = useGetHomeBookingsQuery();
  const [allBookings, setAllBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('pending');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setAllBookings(data.data);
    }
  }, [data]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const hourNumber = parseInt(hour, 10);
    if (hourNumber >= 12) {
      return `${hourNumber === 12 ? 12 : hourNumber - 12}:${minute} مساءً`;
    } else {
      return `${hourNumber}:${minute} صباحًا`;
    }
  };

  const calculateTotalPrice = (booking) => {
    let total = parseFloat(booking.home_service.price) || 0;
    
    if (booking.additionalHomeServiceBookingItems?.length > 0) {
      booking.additionalHomeServiceBookingItems.forEach(item => {
        total += parseFloat(item.service.price) || 0;
      });
    }
    
    const copounDiscount = parseFloat(booking.copoun_discount) || 0;
    const serviceDiscount = parseFloat(booking.service_discount) || 0;
    
    return total - copounDiscount - serviceDiscount;
  };

  const filteredBookings = allBookings.filter(booking => {
    if (activeFilter === 'completed') return booking.booking_status === 'done';
    if (activeFilter === 'pending') return booking.booking_status === 'pending';
    if (activeFilter === 'cancelled') return booking.booking_status === 'cancelled';
    return true;
  });

  const handleShowReceipt = (bookingId) => {
    const booking = allBookings.find(item => item.id === bookingId);
    if (booking) {
      const receiptData = {
        data: {
          ...booking,
          id: booking.id,
          date: booking.date,
          start_time: booking.start_time,
          paid_amount: parseFloat(booking.paid_amount) || 0,
          copoun_discount: parseFloat(booking.copoun_discount) || 0,
          service_discount: parseFloat(booking.service_discount) || 0,
          seller: {
            ...booking.seller,
            first_name: booking.seller.first_name,
            last_name: booking.seller.last_name,
          },
          customer: {
            ...booking.customer,
            first_name: booking.customer.first_name,
            last_name: booking.customer.last_name,
            phone: booking.customer.phone,
          },
          employee: {
            ...booking.employee,
            name: booking.employee?.name || 'غير محدد',
          },
          home_service: {
            ...booking.home_service,
            name: booking.home_service.name,
            price: parseFloat(booking.home_service.price) || 0,
            percentage: parseFloat(booking.home_service.percentage) || 0,
          },
        },
        couponDiscountAmount: parseFloat(booking.copoun_discount) || 0,
        totalPrice: calculateTotalPrice(booking),
        service_type: 'home',
        additionalServices: booking.additionalHomeServiceBookingItems?.map(item => ({
          name: item.service.name,
          price: item.service.price,
        })) || [],
      };

      navigation.navigate('Receipt', { 
        bookingData: receiptData,
        service_type: 'home' 
      });
    }
  };

  const handleCancelPress = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalVisible(true);
  };

  const handleRateService = (booking) => {
    navigation.navigate('RateService', {
      serviceId: booking.home_service.id,
      serviceType: 'home',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading bookings: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الحجوزات المنزلية</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'pending' && styles.activeFilter]}
          onPress={() => setActiveFilter('pending')}
        >
          <Text style={[styles.filterText, activeFilter === 'pending' && styles.activeFilterText]}>القادمة</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'completed' && styles.activeFilter]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[styles.filterText, activeFilter === 'completed' && styles.activeFilterText]}>المكتملة</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'cancelled' && styles.activeFilter]}
          onPress={() => setActiveFilter('cancelled')}
        >
          <Text style={[styles.filterText, activeFilter === 'cancelled' && styles.activeFilterText]}>تم الإلغاء</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            {item.booking_status === 'cancelled' && (
              <View style={styles.cancelledBadge}>
                <Text style={styles.cancelledBadgeText}>ملغي</Text>
              </View>
            )}
            
            {item.request_rejection_reason && (
              <View style={styles.rejectionReasonContainer}>
                <Text style={styles.rejectionReasonText}>سبب الرفض: {item.request_rejection_reason}</Text>
              </View>
            )}
            
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeBox}>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              </View>
              <Icon name="minus" size={18} color="#000000" />
              <View style={styles.dateTimeBox}>
                <Text style={styles.timeText}>{formatTime(item.start_time)}</Text>
              </View>
            </View>
            
            <View style={styles.sellerContainer}>
              <Image 
                source={{ uri: `https://leen-app.com/public/${item.seller.seller_logo}` }} 
                style={styles.sellerImage}
                defaultSource={require('../../assets/images/salon.jpg')}
              />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{item.seller.first_name} {item.seller.last_name}</Text>
                <View style={styles.locationContainer}>
                  <Icon name="map-marker" size={16} color="#666" />
                  <Text style={styles.sellerLocation} numberOfLines={1} ellipsizeMode="tail">
                    {item.location || item.seller.location}
                  </Text>
                </View>
                <View style={styles.serviceContainer}>
                  <Text style={styles.serviceName}>{item.home_service.name}</Text>
                </View>
                <Text style={styles.employeeText}>الموظف: {item.employee?.name || 'غير محدد'}</Text>
              </View>
            </View>

            {item.additionalHomeServiceBookingItems?.length > 0 && (
              <View style={styles.additionalServicesContainer}>
                <Text style={styles.additionalServicesTitle}>خدمات إضافية:</Text>
                {item.additionalHomeServiceBookingItems.map((additionalItem, index) => (
                  <View key={index} style={styles.additionalServiceItem}>
                    <View style={styles.additionalServiceInfo}>
                      <Icon name="plus" size={16} color="#435E58" />
                      <Text style={styles.additionalServiceName}>{additionalItem.service.name}</Text>
                    </View>
                    <Text style={styles.additionalServicePrice}>{additionalItem.service.price} ر.س</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.buttonContainer}>
              {item.booking_status === 'pending' && (
                <>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleCancelPress(item.id)}
                  >
                    <Text style={styles.cancelButtonText}>إلغاء الحجز</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, styles.receiptButton]}
                    onPress={() => handleShowReceipt(item.id)}
                  >
                    <Text style={styles.buttonText}>عرض الإيصال</Text>
                  </TouchableOpacity>
                </>
              )}

              {item.booking_status === 'done' && (
                <>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rateButton]}
                    onPress={() => handleRateService(item)}
                  >
                    <Text style={styles.rateButtonText}>تقييم الخدمة</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, styles.receiptButton]}
                    onPress={() => handleShowReceipt(item.id)}
                  >
                    <Text style={styles.buttonText}>عرض الإيصال</Text>
                  </TouchableOpacity>
                </>
              )}

              {item.booking_status === 'cancelled' && (
                <View style={styles.cancelledStatusContainer}>
                  <Text style={styles.cancelledStatusText}>تم إلغاء هذه الحجز</Text>
                </View>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد حجوزات {activeFilter === 'pending' ? 'قادمة' : activeFilter === 'completed' ? 'مكتملة' : 'ملغية'}</Text>
          </View>
        }
      />

      <CancelBookingModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        bookingId={selectedBookingId}
        navigation={navigation}
        serviceType="home"
      />
    </SafeAreaView>
  )
}

export default HomeBookings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  activeFilter: {
    borderBottomWidth: 2,
    borderBottomColor: '#435E58',
  },
  filterText: {
    fontSize: 16,
    color: '#757575',
    fontFamily: 'AlmaraiRegular',
  },
  activeFilterText: {
    color: '#435E58',
    fontFamily: 'AlmaraiBold',
  },
  listContainer: {
    padding: 15,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cancelledBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 1,
  },
  cancelledBadgeText: {
    color: '#fff',
    fontFamily: 'AlmaraiBold',
    fontSize: 12,
  },
  rejectionReasonContainer: {
    backgroundColor: '#FFF3F3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  rejectionReasonText: {
    color: '#F44336',
    fontFamily: 'AlmaraiRegular',
    fontSize: 14,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    marginBottom: 15,
  },
  dateTimeBox: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#333',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  sellerImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: '#f0f0f0',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellerLocation: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#666',
    marginRight: 5,
    flexShrink: 1,
  },
  serviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  serviceName: {
    fontSize: 15,
    fontFamily: 'AlmaraiBold',
    color: '#435E58',
    flex: 1,
  },
  employeeText: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#666',
  },
  additionalServicesContainer: {
    marginTop: 10,
    paddingTop: 10,
  },
  additionalServicesTitle: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#666',
    marginBottom: 8,
  },
  additionalServiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  additionalServiceInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  additionalServiceName: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#666',
    marginRight: 5,
    textAlign: 'right',
  },
  additionalServicePrice: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#435E58',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '48%',
  },
  receiptButton: {
    backgroundColor: '#435E58',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#435E58',
  },
  rateButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#435E58',
  },
  rateButtonText: {
    color: '#435E58',
    fontFamily: 'AlmaraiBold',
    fontSize: 14,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'AlmaraiBold',
    fontSize: 14,
  },
  cancelButtonText: {
    color: '#435E58',
    fontFamily: 'AlmaraiBold',
    fontSize: 14,
  },
  cancelledStatusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cancelledStatusText: {
    color: '#F44336',
    fontFamily: 'AlmaraiBold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    color: '#666',
  },
});