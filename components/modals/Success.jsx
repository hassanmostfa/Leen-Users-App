import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Success = ({ visible, message, description, buttonText, onPress }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.successCard}>
          {/* Success Icon */}
          <Icon name="check-circle" size={60} color="#435E58" />
          
          {/* Success Message */}
          <Text style={styles.successTitle}>{message}</Text>

          {/* Success Description */}
          {description && <Text style={styles.successDescription}>{description}</Text>}
          
          {/* Action Button */}
          <Pressable style={styles.successButton} onPress={onPress}>
            <Text style={styles.successButtonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Success;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  successCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    color: '#666',
    marginVertical: 5,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#435E58',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
});
