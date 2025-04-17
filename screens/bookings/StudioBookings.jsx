import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetStudioBookingsQuery } from '../../API/shared/BookStudioService'
import CancelBookingModal from '../../components/bookings/CancelBookingModal';

const StudioBookings = ({ navigation }) => {
  const { data, isLoading, isError, error } = useGetStudioBookingsQuery();
  const [allBookings, setAllBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('pending'); // Default filter
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setAllBookings(data.data);
    }
  }, [data]);

  // Format the date in Arabic locale
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format the time in Arabic (e.g., 10 صباحًا)
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

  // Parse JSON strings in service details and employees
  const parseServiceDetails = (details) => {
    try {
      if (typeof details === 'string') {
        return JSON.parse(details).join(' • ');
      }
      return details.join(' • ');
    } catch (e) {
      return details || 'لا توجد تفاصيل';
    }
  };

  // Calculate total price including additional services
  const calculateTotalPrice = (booking) => {
    let total = parseFloat(booking.studio_service.price) || 0;
    
    if (booking.additionalStudioServiceBookingItems?.length > 0) {
      booking.additionalStudioServiceBookingItems.forEach(item => {
        total += parseFloat(item.service.price) || 0;
      });
    }
    
    // Apply discounts if any
    const copounDiscount = parseFloat(booking.copoun_discount) || 0;
    const serviceDiscount = parseFloat(booking.service_discount) || 0;
    
    return total - copounDiscount - serviceDiscount;
  };

  // Filter bookings based on active filter
  const filteredBookings = allBookings.filter(booking => {
    if (activeFilter === 'completed') return booking.booking_status === 'done';
    if (activeFilter === 'pending') return booking.booking_status === 'pending';
    if (activeFilter === 'cancelled') return booking.booking_status === 'cancelled';
    return true;
  });

  const handleShowReceipt = (bookingId) => {
    const booking = allBookings.find(item => item.id === bookingId);
    if (booking) {
      // Prepare the receipt data structure
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
          studio_service: {
            ...booking.studio_service,
            name: booking.studio_service.name,
            price: parseFloat(booking.studio_service.price) || 0,
            percentage: parseFloat(booking.studio_service.percentage) || 0,
          },
        },
        // Additional data needed for receipt calculations
        couponDiscountAmount: parseFloat(booking.copoun_discount) || 0,
        totalPrice: calculateTotalPrice(booking),
        service_type: 'studio',
        // Include additional services if any
        additionalServices: booking.additionalStudioServiceBookingItems?.map(item => ({
          name: item.service.name,
          price: item.service.price,
        })) || [],
      };

      navigation.navigate('Receipt', { 
        bookingData: receiptData,
        service_type: 'studio' 
      });
    }
  };

  const handleCancelPress = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalVisible(true);
  };

  const handleConfirmCancel = () => {
    console.log('Canceling booking:', selectedBookingId);
    // Here you would typically call an API to cancel the booking
    setIsModalVisible(false);
    setSelectedBookingId(null);
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
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>حجوزات المقر</Text>
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Filter Links */}
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

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            {/* Cancelled Badge */}
            {item.booking_status === 'cancelled' && (
              <View style={styles.cancelledBadge}>
                <Text style={styles.cancelledBadgeText}>ملغي</Text>
              </View>
            )}
            
            {/* Rejection Reason */}
            {item.request_rejection_reason && (
              <View style={styles.rejectionReasonContainer}>
                <Text style={styles.rejectionReasonText}>سبب الرفض: {item.request_rejection_reason}</Text>
              </View>
            )}
            
            {/* Date and Time */}
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeBox}>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              </View>
              <Icon name="minus" size={18} color="#000000" />
              <View style={styles.dateTimeBox}>
                <Text style={styles.timeText}>{formatTime(item.start_time)}</Text>
              </View>
            </View>
            
            {/* Seller Info */}
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
                    {item.seller.location}
                  </Text>
                </View>
                {/* Main Service Info */}
                <View style={styles.serviceContainer}>
                  <Text style={styles.serviceName}>{item.studio_service.name}</Text>
                </View>
                <Text style={styles.employeeText}>الموظف: {item.employee?.name || 'غير محدد'}</Text>
              </View>
            </View>

            {/* Additional Services */}
            {item.additionalStudioServiceBookingItems?.length > 0 && (
              <View style={styles.additionalServicesContainer}>
                <Text style={styles.additionalServicesTitle}>خدمات إضافية:</Text>
                {item.additionalStudioServiceBookingItems.map((additionalItem, index) => (
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

            {/* Action Buttons */}
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

              {(item.booking_status === 'done' || item.booking_status === 'cancelled') && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.receiptButton, { flex: 1 }]}
                  onPress={() => handleShowReceipt(item.id)}
                >
                  <Text style={styles.buttonText}>عرض الإيصال</Text>
                </TouchableOpacity>
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

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmCancel}
      />
    </SafeAreaView>
  )
}

export default StudioBookings

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
  servicePrice: {
    fontSize: 15,
    fontFamily: 'AlmaraiBold',
    color: '#435E58',
    marginLeft: 10,
  },
  serviceDetails: {
    fontSize: 13,
    fontFamily: 'AlmaraiRegular',
    color: '#666',
    marginBottom: 8,
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
  totalPriceContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalPriceText: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#333',
  },
  totalPriceAmount: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#435E58',
  },
  discountsContainer: {
    marginTop: 5,
  },
  discountText: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#666',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    gap: 10,
    justifyContent: 'center',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptButton: {
    backgroundColor: '#435E58',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#435E58',
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