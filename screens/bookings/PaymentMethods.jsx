import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper'; // Import RadioButton
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import visaIamge from '../../assets/visa.png'; // Import images
import masterIamge from '../../assets/card.png';
import applePayIamge from '../../assets/apple-pay.png';
import googlePayIamge from '../../assets/google-pay.png';
import { useBookStudioServiceMutation } from '../../API/shared/BookStudioService';
import { useBookHomeServiceMutation } from '../../API/shared/BookHomeService';
import SuccessPayment from '../../components/payment/SuccessPayment'; // Import the SuccessPayment component

// Utility function to format date and add one day
const formatDateAndAddDay = (dateString) => {
  const date = new Date(dateString); // Convert the selected date string to a Date object
  date.setDate(date.getDate()); // Add one day to the date

  // Format the date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const PaymentMethods = ({ route, navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState(null); // State to track selected payment method
  const [showCreditCardForm, setShowCreditCardForm] = useState(false); // State to control credit card form visibility
  const [creditCardData, setCreditCardData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  }); // State to store credit card data

  const [paymentSuccess, setPaymentSuccess] = useState(false); // State to indicate payment success
  const [bookingId, setBookingId] = useState(null); // State to store booking ID
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // State to control success modal visibility
  const [bookingData, setBookingData] = useState(null); // State to store booking data from API response

  // Check if route.params exists
  if (!route.params) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data found. Please go back and try again.</Text>
      </View>
    );
  }

  // Destructure parameters
  const { selectedService, selectedEmployee, selectedDate, selectedTime, totalPrice, selectedOption, couponDiscountAmount , service_type } = route.params;

  console.log("Service Type For Payment:", service_type);
  
  // Format the date for better readability
  const formattedDate = new Date(selectedDate).toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Payment methods data
  const paymentMethods = [
    { id: 1, name: 'بطاقة الائتمان/الخصم', details: '**** 2345', image: visaIamge },
    { id: 2, name: 'بطاقة الائتمان/الخصم', details: '**** 3456', image: masterIamge },
    { id: 4, name: 'آبل باي', details: '', image: applePayIamge },
    { id: 5, name: 'جوجل باي', details: '', image: googlePayIamge },
    { id: 6, name: 'تمارا', details: '' },
    { id: 7, name: 'تابي', details: '' },
  ];

  // RTK Query Mutation
  const [bookStudioService, { isLoading }] = useBookStudioServiceMutation();
  const [bookHomeService, { isLoading: isLoadingHome }] = useBookHomeServiceMutation();
  // Handle payment method selection
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);

    // Show credit card form for the first two options
    if (methodId === 1 || methodId === 2) {
      setShowCreditCardForm(true);
    } else {
      setShowCreditCardForm(false);
    }
  };

  // Handle credit card input changes
  const handleCreditCardInputChange = (field, value) => {
    setCreditCardData({ ...creditCardData, [field]: value });
  };

  // Handle payment submission
const handlePayment = async () => {
  const adjustedDate = formatDateAndAddDay(selectedDate);
  
  const bookingData = {
    [service_type === 'studio' ? 'studio_service_id' : 'home_service_id']: selectedService.id,
    seller_id: selectedService.seller.id,
    employee_id: selectedEmployee.id,
    date: adjustedDate,
    start_time: selectedTime,
    paid_amount: totalPrice,
    couponDiscountAmount: couponDiscountAmount,
    location: 'no Location',
    copoun_discount : couponDiscountAmount
  };

  try {
    let response;
    if (service_type === 'studio') {
      response = await bookStudioService(bookingData).unwrap();
      console.log('Studio Booking successful:', response);
    } else {
      response = await bookHomeService(bookingData).unwrap();
      console.log('HomeBooking successful:', response);
    }

    setBookingId(response.bookingId); // Make sure this matches your API response structure
    setBookingData(response);
    setIsSuccessModalVisible(true);
  } catch (error) {
    console.error('Booking failed:', error);
    // Add error handling UI here
  }
};

  console.log('couponDiscountAmount:', couponDiscountAmount);

  // Handle "عرض الإيصال" button click
  const handleViewReceipt = () => {
    setIsSuccessModalVisible(false); // Close the modal

    // Pass couponDiscountAmount to the Receipt component
    navigation.navigate('Receipt', {
      bookingData: {
        ...bookingData, // Include all booking data
        couponDiscountAmount: couponDiscountAmount, // Pass the coupon discount amount
      },
      service_type
    });
  };

  // Handle "العودة للصفحة الرئيسية" button click
  const handleReturnToHome = () => {
    setIsSuccessModalVisible(false); // Close the modal
    navigation.navigate('Home'); // Navigate to Home screen
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-right" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>حدد طريقة دفع</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Payment Methods */}
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map((method) => (
            <View key={method.id}>
              <TouchableOpacity
                style={[
                  styles.paymentCard,
                  selectedMethod === method.id && styles.selectedPaymentCard, // Highlight selected card
                ]}
                onPress={() => handleSelectMethod(method.id)}
              >
                {/* Radio Button */}
                <RadioButton
                  value={method.id}
                  status={selectedMethod === method.id ? 'checked' : 'unchecked'}
                  onPress={() => handleSelectMethod(method.id)}
                  color="#007BFF" // Custom color for the radio button
                />

                {/* Payment Method Text */}
                <View style={styles.paymentMethodTextContainer}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  {method.details ? <Text style={styles.paymentMethodDetails}>{method.details}</Text> : null}
                </View>

                {/* Payment Method Image */}
                {method.image && (
                  <Image source={method.image} style={styles.paymentMethodImage} />
                )}
              </TouchableOpacity>

              {/* Credit Card Form (Under the Selected Option) */}
              {showCreditCardForm && selectedMethod === method.id && (
                <View style={styles.creditCardForm}>
                  {/* Card Holder Name Input */}
                  <TextInput
                    style={styles.input}
                    placeholder="اسم صاحب البطاقة"
                    value={creditCardData.cardHolderName}
                    onChangeText={(text) => handleCreditCardInputChange('cardHolderName', text)}
                  />

                  {/* Card Number Input */}
                  <TextInput
                    style={styles.input}
                    placeholder="رقم البطاقة"
                    value={creditCardData.cardNumber}
                    onChangeText={(text) => handleCreditCardInputChange('cardNumber', text)}
                    keyboardType="numeric"
                  />

                  {/* Expiry Date and CVV in the Same Row */}
                  <View style={styles.rowInputContainer}>
                    <TextInput
                      style={[styles.input, styles.rowInput]}
                      placeholder="تاريخ الانتهاء (MM/YY)"
                      value={creditCardData.expiryDate}
                      onChangeText={(text) => handleCreditCardInputChange('expiryDate', text)}
                    />
                    <TextInput
                      style={[styles.input, styles.rowInput]}
                      placeholder="CVV"
                      value={creditCardData.cvv}
                      onChangeText={(text) => handleCreditCardInputChange('cvv', text)}
                      keyboardType="numeric"
                      secureTextEntry={true}
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <TouchableOpacity style={styles.payNowButton} onPress={handlePayment} disabled={isLoading}>
        <Text style={styles.payNowButtonText}>{isLoading ? 'جاري التحميل...' : 'ادفع الان'}</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <SuccessPayment
        isVisible={isSuccessModalVisible}
        bookingId={bookingId}
        onClose={handleReturnToHome} // Handle "العودة للصفحة الرئيسية"
        onViewReceipt={handleViewReceipt} // Handle "عرض الإيصال"
      />
    </View>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 16,
    direction: 'rtl',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Add padding to avoid button overlap
  },
  paymentMethodsContainer: {
    marginTop: 20,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPaymentCard: {
    borderColor: '#435E58',
    borderWidth: 2,
  },
  paymentMethodImage: {
    width: 40,
    height: 25,
    marginLeft: 'auto', // Move image to the end of the card
    resizeMode: 'contain',
  },
  paymentMethodTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#000',
  },
  paymentMethodDetails: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#555555',
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    color: '#FF0000',
    textAlign: 'center',
  },
  creditCardForm: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontFamily: 'AlmaraiRegular',
    backgroundColor: '#F5F5F5', // Set input background color
  },
  rowInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    width: '48%', // Adjust width to fit two inputs in the same row
  },
  payNowButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#435E58',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowButtonText: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    color: '#FFF',
  },
});