import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView , StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const Receipt = ({navigate}) => {
  const route = useRoute();
  const { bookingData, service_type } = route.params;
  console.log("Booking Data:", bookingData);
  
  const navigation = useNavigation();
  const qrCodeRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Safely access booking data with fallbacks
  const data = bookingData?.data || {};
  const seller = data?.seller || {};
  const customer = data?.customer || {};
  const employee = data?.employee || {};

  // Service data access
  let service = {};
  if (service_type === "studio") {
    service = data?.studio_service || {};
  } else {
    service = data?.home_service || bookingData?.home_service || {};
  }

  // Calculations
  const couponDiscountAmount = bookingData?.couponDiscountAmount || 0;
  const servicePrice = service?.price ? parseFloat(service.price) : 0;
  const discountPercentage = service?.percentage ? parseFloat(service.percentage) : 0;
  const discountAmount = (servicePrice * discountPercentage) / 100;

  // Formatting functions
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('ar', { month: 'long' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return 'غير محدد';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'غير محدد';
    try {
      const [hours] = timeString.split(':');
      const hour = parseInt(hours, 10);
      if (hour < 12) return `${hour} صباحًا`;
      if (hour === 12) return `12 ظهرًا`;
      return `${hour - 12} مساءً`;
    } catch (e) {
      return 'غير محدد';
    }
  };

  // Receipt items
  const firstSixItems = [
    { label: 'رقم الحجز', value: data?.id || 'غير محدد' },
    { label: 'مقدم الخدمة', value: `${seller?.first_name || ''} ${seller?.last_name || ''}`.trim() || 'غير محدد' },
    { label: 'اسم العميل', value: `${customer?.first_name || ''} ${customer?.last_name || ''}`.trim() || 'غير محدد' },
    { label: 'هاتف العميل', value: customer?.phone || 'غير محدد' },
    { label: 'التاريخ', value: formatDate(data?.date) },
    { label: 'الوقت', value: formatTime(data?.start_time) },
    { label: 'المتخصص', value: employee?.name || 'غير محدد' },
  ];

  const remainingItems = [
    { label: service?.name || 'الخدمة', value: `${servicePrice.toFixed(2)} ر.س` },
    { label: 'خصم الخدمة', value: `${discountAmount.toFixed(2)} ر.س` },
    { label: 'خصم الكوبون', value: `${couponDiscountAmount.toFixed(2)} ر.س` },
    { label: 'المبلغ الإجمالي', value: `${data?.paid_amount?.toFixed(2) || '0.00'} ر.س` },
  ];

  // QR Code data
  const qrCodeData = `
رقم الإيصال: ${data?.id || 'غير محدد'}
مقدم الخدمة: ${seller?.first_name || ''} ${seller?.last_name || ''}
اسم العميل: ${customer?.first_name || ''} ${customer?.last_name || ''}
هاتف العميل: ${customer?.phone || 'غير محدد'}
التاريخ: ${formatDate(data?.date)}
الوقت: ${formatTime(data?.start_time)}
المتخصص: ${employee?.name || 'غير محدد'}
الخدمة: ${service?.name || 'غير محدد'}
سعر الخدمة: ${servicePrice.toFixed(2)} ريال سعودي
الخصم: ${discountPercentage}%
خصم الكوبون: ${couponDiscountAmount.toFixed(2)} ريال سعودي
المبلغ الإجمالي: ${data?.paid_amount?.toFixed(2) || '0.00'} ريال سعودي
  `;

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Option 1: Try with QR code first
      let qrCodeImage = '';
      try {
        const qrCodeBase64 = await new Promise((resolve, reject) => {
          if (qrCodeRef.current) {
            qrCodeRef.current.toDataURL(resolve);
          } else {
            reject(new Error('QR Code not available'));
          }
        });
        qrCodeImage = `<img src="${qrCodeBase64}" width="150" height="150" />`;
      } catch (qrError) {
        console.warn('QR Code generation failed, using text fallback');
        qrCodeImage = `
          <div style="text-align: center; border: 1px solid #ddd; padding: 10px; margin: 10px;">
            <p>رمز الاستجابة السريعة غير متوفر</p>
            <p>رقم الحجز: ${data?.id || 'غير محدد'}</p>
          </div>
        `;
      }

      const htmlContent = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: Arial;
                direction: rtl;
                padding: 20px;
                background-color: #f9f9f9;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .title {
                font-size: 20px;
                font-weight: bold;
                color: #333;
              }
              .qr-container {
                text-align: center;
                margin: 15px 0;
              }
              .card {
                background: white;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .item-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
              }
              .label {
                font-weight: bold;
                color: #444;
              }
              .value {
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">إيصال الدفع</div>
            </div>

            <div class="qr-container">
              ${qrCodeImage}
              <p style="margin-top: 10px;">رمز التحقق من الحجز</p>
            </div>

            <div class="card">
              ${firstSixItems.map(item => `
                <div class="item-row">
                  <span class="label">${item.label}</span>
                  <span class="value">${item.value}</span>
                </div>
              `).join('')}
            </div>

            <div class="card">
              ${remainingItems.map(item => `
                <div class="item-row">
                  <span class="label">${item.label}</span>
                  <span class="value">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 595,  // A4 width
        height: 842, // A4 height
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'حفظ الإيصال',
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert('خطأ', 'لا يمكن مشاركة الملف على هذا الجهاز');
      }
    } catch (error) {
      console.error('PDF Generation Error:', error);
      Alert.alert('خطأ', 'فشل في إنشاء الإيصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-right" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>الإيصال</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home-variant-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.qrCodeContainer}>
        <QRCode
          value={qrCodeData}
          size={150}
          color="#333"
          backgroundColor="#F6F6F6"
          getRef={qrCodeRef}
        />
        <Text style={styles.qrCodeText}>
        قم بمسح رمز الاستجابة السريعة هذا في الصالون لتسجيل الوصول السريع.
        </Text>
      </View>

      <View style={styles.card}>
        {firstSixItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        {remainingItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.downloadButton, isGeneratingPDF && styles.disabledButton]}
        onPress={generatePDF}
        disabled={isGeneratingPDF}
      >
        <Text style={styles.downloadButtonText}>
          {isGeneratingPDF ? 'جاري إنشاء الإيصال...' : 'تحميل الإيصال'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 16,
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrCodeText: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    marginTop: 10,
    textAlign: 'center',
    width: '80%',
    lineHeight: 25,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'AlmaraiBold',
    fontSize: 15,
    color: '#333',
  },
  value: {
    fontFamily: 'AlmaraiRegular',
    fontSize: 15,
    color: '#666',
  },
  downloadButton: {
    backgroundColor: '#435E58',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  downloadButtonText: {
    color: 'white',
    fontFamily: 'AlmaraiBold',
    fontSize: 16,
  },
});

export default Receipt;