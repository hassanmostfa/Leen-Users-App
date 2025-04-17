import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import srFlag from '../../assets/images/avatars/sr-flag.png';

const Register = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store each digit
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // State to track verification success

  const otpInputRefs = useRef([]);

  // Send OTP to user's phone
  const handleSendOtp = async () => {
    if (!phone) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        'https://leen-app.com/public/api/send-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: `+966${phone}` }), // Include country code
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
      } else {
        Alert.alert('خطأ', data.message || 'لم يتم الارسال');
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const fullOtp = otp.join(''); // Combine the digits into a single string
    if (fullOtp.length !== 6) {
      Alert.alert('خطأ', 'يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://leen-app.com/public/api/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: `+966${phone}`, otp: fullOtp }), // Include country code
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsVerified(true); // Show success card
      } else {
        Alert.alert('خطأ', data.message || 'رمز التحقق غير صحيح');
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus the next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" />

      {!isOtpSent ? (
        // Phone Number Input to Send OTP
        <>
          <Text style={styles.title}>إنشاء حساب جديد</Text>

          {/* Phone Input with Saudi Arabia Icon and Country Code */}
          <Text style={styles.label}>رقم الهاتف</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.countryCodeContainer}>
              <Image source={srFlag} style={styles.countryCodeImage} />
              <Text style={styles.countryCodeText}>+966</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="5XXXXXXX"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Message */}
          <Text style={styles.messageText}>
            سيتم إرسال رمز التحقق عبر واتساب أو رسالة نصية
          </Text>

          {/* Send OTP Button */}
          <Pressable
            style={styles.button}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>إرسال رمز التحقق</Text>
            )}
          </Pressable>

        </>
      ) : (
        // OTP Input for Verification
        <>
          <Text style={styles.title}>التحقق من الرمز</Text>
          <Text style={styles.subtitle}>أدخل رمز التحقق المرسل إلى رقم هاتفك .</Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                ref={(ref) => (otpInputRefs.current[index] = ref)}
              />
            ))}
          </View>

          {/* Verify OTP Button */}
          <Pressable
            style={styles.button}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>تأكيد الرمز</Text>
            )}
          </Pressable>
        </>
      )}

      {/* Footer Text */}
      <Text style={styles.footerText}>
        ستنتهي صلاحية الرمز خلال : 01:30 دقيقة
      </Text>

      {/* Success Card */}
      <Modal
        visible={isVerified}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.successCard}>
            {/* Success Icon */}
            <Icon name="check-circle" size={60} color="#435E58" />
            {/* Title */}
            <Text style={styles.successTitle}>تم التحقق من الرمز بنجاح!</Text>
            {/* Subtitle */}
            <Text style={styles.successSubtitle}>أنت الآن جاهز لأستكمال التسجيل </Text>
            {/* Button to Navigate to Signup Form */}
            <Pressable
              style={styles.successButton}
              onPress={() => navigation.navigate('RegisterForm' , {phone : `${phone}`})}
            >
              <Text style={styles.successButtonText}>استكمل التسجيل</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    color: 'black',
    marginBottom: 30,
    fontFamily: 'AlmaraiBold',
  },
  subtitle: {
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 30,
    fontFamily: 'AlmaraiRegular',
  },
  label: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
    fontFamily: 'AlmaraiRegular',
    textAlign: 'right',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#E7E7E7',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 2,
    borderRightColor: '#E7E7E7',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#ADB3BC',
    marginLeft: 5,
    fontFamily: 'AlmaraiRegular',
  },
  countryCodeImage: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: 'contain',
  },
  phoneInput: {
    flex: 1,
    padding: 15,
    color: '#000',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  messageText: {
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 20,
    fontFamily: 'AlmaraiRegular',
    alignSelf: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 40,
    borderWidth: 2,
    borderColor: '#E7E7E7',
    borderRadius: 10,
    textAlign: 'center',
    fontFamily: 'AlmaraiRegular',
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#435E58',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  footerText: {
    color: '#6D6D6D',
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222CC',
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  successTitle: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'AlmaraiBold',
    marginTop: 10,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6D6D6D',
    fontFamily: 'AlmaraiRegular',
    marginTop: 10,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#435E58',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
});

export default Register;