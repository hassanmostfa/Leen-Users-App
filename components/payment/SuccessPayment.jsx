import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons

const SuccessPayment = ({ isVisible, bookingId, onClose, onViewReceipt }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Circle Check Icon */}
          <View style={styles.iconContainer}>
            <Icon name="check-circle" size={60} color="#435E58" />
          </View>

          {/* Title */}
          <Text style={styles.modalTitle}>تم تأكيد موعد الصالون الخاص بك!</Text>

          {/* Description */}
          <Text style={styles.modalDescription}>
            نشكرك على الدفع، ونتطلع إلى رؤيتك قريبًا.
          </Text>

          {/* View Receipt Button */}
          <TouchableOpacity style={styles.receiptButton} onPress={onViewReceipt}>
            <Text style={styles.receiptButtonText}>عرض الإيصال</Text>
          </TouchableOpacity>

          {/* Return to Home Button */}
          <TouchableOpacity style={styles.homeButton} onPress={onClose}>
            <Text style={styles.homeButtonText}>العودة للصفحة الرئيسية</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessPayment;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#435E58',
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    marginBottom: 20,
    textAlign: 'center',
    color: '#555555',
  },
  receiptButton: {
    backgroundColor: '#435E58',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptButtonText: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#FFF',
  },
  homeButton: {
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#435E58',
  },
  homeButtonText: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#435E58',
  },
});