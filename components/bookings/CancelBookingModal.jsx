import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCancelHomeBookingMutation } from '../../API/shared/BookHomeService';
import { useCancelStudioBookingMutation } from '../../API/shared/BookStudioService';
import Success from '../modals/Success';
import { useNavigation } from '@react-navigation/native';

const CancelBookingModal = ({ visible, onClose, bookingId, serviceType }) => {
  const [cancelHomeBooking, { isSuccess: isHomeCancelSuccess }] = useCancelHomeBookingMutation();
  const [cancelStudioBooking, { isSuccess: isStudioCancelSuccess }] = useCancelStudioBookingMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [cancellationResult, setCancellationResult] = useState(null);

  const navigation = useNavigation();

  const handleCancelBooking = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = serviceType === "home" 
        ? await cancelHomeBooking(bookingId).unwrap()
        : await cancelStudioBooking(bookingId).unwrap();

      setCancellationResult(result);
      setShowSuccess(true);
      
    } catch (err) {
      console.error('Cancellation error:', err);
      setError(err.data?.message || 'حدث خطأ أثناء محاولة الإلغاء. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close the cancellation modal when success modal is shown
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    if (serviceType === "home") {
      navigation.replace('HomeBookings', { refresh: true }); // Pass refresh param
    } else {
      navigation.replace('StudioBookings', { refresh: true });
      onClose();
    }
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#435E58" />
            </TouchableOpacity>
            
            <View style={styles.modalContent}>
              <Text style={styles.title}>إلغاء الحجز؟</Text>
              <Text style={styles.message}>هل أنت متأكد أنك تريد الإلغاء؟</Text>
              <Text style={styles.note}>سيؤدي إلغاء موعدك إلى إزالته من حجوزاتك القادمة.</Text>
              
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancelBooking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#435E58" />
                ) : (
                  <Text style={styles.cancelButtonText}>نعم، إلغاء الحجز</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.keepButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.keepButtonText}>الحفاظ على الموعد</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal - Shows cancellation result */}
      <Success
        visible={showSuccess}
        message="تم إلغاء الحجز بنجاح"
        description={cancellationResult?.message || "تم إلغاء حجزك بنجاح"}
        buttonText="العودة إلى الحجوزات"
        onPress={handleSuccessConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 30,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalContent: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
    color: '#0B0C15',
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#0B0C15',
    textAlign: 'center',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#0B0C15',
    textAlign: 'center',
    marginBottom: 25,
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#435E58',
  },
  keepButton: {
    backgroundColor: '#435E58',
  },
  cancelButtonText: {
    color: '#435E58',
    fontFamily: 'AlmaraiBold',
    fontSize: 16,
  },
  keepButtonText: {
    color: '#fff',
    fontFamily: 'AlmaraiBold',
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
    fontFamily: 'Almarai',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default CancelBookingModal;