import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RadioButton } from 'react-native-paper'; // For radio buttons
import { useApplyCouponMutation } from '../../API/Coupon';
import Toast from 'react-native-toast-message';

const BookingDetails = ({ route, navigation }) => {
  // Extract data from route params
  const { selectedService, selectedEmployee, selectedDate, selectedTime , service_type} = route.params;
  
  // State to manage the selected payment option
  const [selectedOption, setSelectedOption] = useState('');

  // State to manage the coupon code input
  const [couponCode, setCouponCode] = useState('');
  const [isValidCoupon, setIsValidCoupon] = useState(false);
  const [discountedPercentage, setDiscountedPercentage] = useState(0);
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();
  // Payment options
  const paymentOptions = [
    { id: '1', label: 'دفع المبلغ كامل', description: 'قم بتأمين حجزك على الفور', value: 'paid' },
    { id: '2', label: 'دفع نصف المبلغ', description: 'تسوية باقي المبلغ بعد موعدك', value: 'partiallyPaid' },
    { id: '3', label: 'الدفع في الصالون', description: 'تسوية الدفع بعد موعدك', value: 'unpaid' },
  ];

  // Format the date in Arabic locale
  const formattedDate = selectedDate.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format the time in Arabic (e.g., 10 صباحًا)
  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNumber = parseInt(hour, 10);
    if (hourNumber >= 12) {
      return `${hourNumber === 12 ? 12 : hourNumber - 12}:${minute} مساءً`;
    } else {
      return `${hourNumber}:${minute} صباحًا`;
    }
  };

  const formattedTime = formatTime(selectedTime);

  // Function to handle coupon code validation
  const handleCheckCoupon = async () => {
    try {
      const response = await applyCoupon({ code: couponCode }).unwrap();
  
      setIsValidCoupon(true);
      setDiscountedPercentage(response.discount_value);
  
      Toast.show({
        type: 'success',
        text1: 'تم تطبيق الكوبون بنجاح',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
    } catch (error) {      
      setIsValidCoupon(false);
      setDiscountedPercentage(0);
      Toast.show({
        type: 'error',
        text1: 'فشل في التحقق من الكوبون',
        text2: error?.data?.message || 'حدث خطأ أثناء التحقق من الكوبون',
        position: 'top',
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 50,
      });
    }
  };
  // Calculate discounts and total price
const servicePrice = selectedService.price;
console.log(selectedService);

// Service discount (if applicable)
let serviceDiscountPercentage = 0; // Default to 0 if no discount
if (selectedService.discount === 1) {
  serviceDiscountPercentage = selectedService.percentage; // Use the service's discount percentage
}
const serviceDiscountAmount = (servicePrice * serviceDiscountPercentage) / 100;

// Coupon discount (if applicable)
const couponDiscountAmount = (servicePrice * discountedPercentage) / 100;

// Total price after discounts
const totalPrice = servicePrice - serviceDiscountAmount - couponDiscountAmount;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header with Back Icon */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-right" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>ملخص الحجز</Text>
        </View>

        {/* White Card for Salon Details */}
        <View style={styles.card}>
          {/* Image on the left */}
          <Image source={{ uri: selectedService.seller.seller_banner }} style={styles.banner} />

          {/* Details on the right */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sellerName}>
              {selectedService.seller.first_name + ' ' + selectedService.seller.last_name}
            </Text>
            {/* Location Icon and Text */}
            <View style={styles.locationContainer}>
              <Icon name="map-marker-outline" size={20} color="#888888" />
              <Text style={styles.sellerLocation}>
                {selectedService.seller.location ?? 'هنا يجب كتابة الموقع'}
              </Text>
            </View>
            <Text style={styles.rating}>
              {selectedService.seller_average_rating} <Icon name="star" size={20} color="#FFD33C" />
            </Text>
          </View>
        </View>

        {/* Line Separator */}
        <View style={styles.separator} />

        {/* تفاصيل الحجز Section */}
        <Text style={styles.sectionTitle}>تفاصيل الحجز</Text>

        {/* التاريخ والوقت Section */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>التاريخ والوقت</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.sectionText}>{formattedDate}</Text>
            <View style={styles.gap} />
            <Text style={styles.sectionText}>{formattedTime}</Text>
          </View>
        </View>

        {/* المتخصص Section */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>المتخصص</Text>
          <Text style={styles.sectionText}>{selectedEmployee.name}</Text>
        </View>

        {/* Line Separator */}
        <View style={styles.separator} />

        {/* Payment Options Section */}
        <Text style={styles.sectionTitle}>طريقة الدفع</Text>
        <View style={styles.paymentOptionsContainer}>
          {paymentOptions.map((option) => (
            <View key={option.id} style={styles.radioButtonContainer}>
              <View style={styles.radioButtonTextContainer}>
                <Text style={styles.radioButtonLabel}>{option.label}</Text>
                <Text style={styles.radioButtonDescription}>{option.description}</Text>
              </View>
              <View style={styles.radioButtonInputContainer}>
                <RadioButton
                  value={option.value} // Use option.value here
                  status={selectedOption === option.value ? 'checked' : 'unchecked'}
                  onPress={() => setSelectedOption(option.value)}
                  color="#007BFF" // Custom color for the radio button
                />
              </View>
            </View>
          ))}
        </View>

        {/* Line Separator */}
        <View style={styles.separator} />

        {/* كود الخصم Section */}
        <Text style={styles.sectionTitle}>كود الخصم</Text>
        <View style={styles.discountCard}>
          <Icon name="ticket-percent-outline" size={24} color="#888888" style={styles.discountIcon} />
          <TextInput
            style={styles.discountInput}
            placeholder="أدخل كود الخصم"
            value={couponCode}
            onChangeText={setCouponCode}
          />
          <TouchableOpacity style={styles.checkButton} onPress={handleCheckCoupon}>
            <Text style={styles.checkButtonText}>ارسل</Text>
          </TouchableOpacity>
        </View>

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>تفاصيل التسعير</Text>
          <View style={styles.priceDetailsContainer}>
            <View style={styles.priceDetail}>
              <Text style={styles.priceDetailLabel}>{selectedService.name}</Text>
              <Text style={styles.priceDetailValueLight}>{servicePrice} ر.س</Text>
            </View>
            <View style={styles.priceDetail}>
              <Text style={styles.priceDetailLabel}>قيمة خصومات الخدمة</Text>
              <Text style={styles.priceDetailValueLight}>{serviceDiscountAmount} ر.س</Text>
            </View>
            <View style={styles.priceDetail}>
              <Text style={styles.priceDetailLabel}>قيمة خصومات الكوبون</Text>
              <Text style={styles.priceDetailValueLight}>{couponDiscountAmount} ر.س</Text>
            </View>
            <View style={styles.priceDetail}>
              <Text style={styles.priceDetailLabelBold}>الإجمالي</Text>
              <Text style={styles.priceDetailValueBold}>{totalPrice} ر.س</Text>
            </View>
          </View>
        </View>

        {/* Bottom Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate('PaymentMethods', {
              selectedService,
              selectedEmployee,
              selectedDate,
              selectedTime,
              totalPrice,
              selectedOption,
              couponDiscountAmount,
              service_type
            })
          }>
          <Text style={styles.continueButtonText}>استمر</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    direction: 'rtl',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 100,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
    marginLeft: 10,
  },
  card: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  banner: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  sellerName: {
    fontSize: 15,
    fontFamily: 'AlmaraiBold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellerLocation: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#888888',
    marginLeft: 4,
  },
  rating: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gap: {
    width: 8,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#555555',
  },
  paymentOptionsContainer: {
    marginTop: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space between label and input
    paddingVertical: 16,
  },
  radioButtonTextContainer: {
    flex: 1, // Take up remaining space
  },
  radioButtonInputContainer: {
    marginLeft: 16, // Space between label and input
  },
  radioButtonLabel: {
    fontSize: 15,
    fontFamily: 'AlmaraiBold',
    color: '#000',
  },
  radioButtonDescription: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  discountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discountIcon: {
    marginRight: 16,
  },
  discountInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#555555',
  },
  checkButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  checkButtonText: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#435E58',
  },
  priceContainer: {
    marginTop: 20,
  },
  priceLabel: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    marginBottom: 10,
  },
  priceDetailsContainer: {
    padding: 16,
  },
  priceDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceDetailLabel: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#555555',
  },
  priceDetailLabelBold: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#000',
  },
  priceDetailValueLight: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#555555',
  },
  priceDetailValueBold: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#435E58',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 30,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#FFF',
  },
});