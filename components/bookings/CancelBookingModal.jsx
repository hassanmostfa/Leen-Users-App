import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet , StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CancelBookingModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >

      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#435E58" />
          </TouchableOpacity>
          
          {/* Modal content */}
          <View style={styles.modalContent}>
            <Text style={styles.title}>إلغاء الحجز؟</Text>
            <Text style={styles.message}>هل أنت متأكد أنك تريد الإلغاء؟</Text>
            <Text style={styles.note}>سيؤدي إلغاء موعدك إلى إزالته من حجوزاتك القادمة.</Text>
            
            {/* Action buttons */}
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onConfirm}
            >
              <Text style={styles.cancelButtonText}>نعم، إلغاء الحجز</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.keepButton]}
              onPress={onClose}
            >
              <Text style={styles.keepButtonText}>الحفاظ على الموعد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    color: '##0B0C15',
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
});

export default CancelBookingModal;