import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterForm = ({ phoneNumber, navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [location, setLocation] = useState('');
  const { phone } = route.params;

  const getLocation = async () => {
    // Request permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    try {
      // Get current position
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation(`${latitude}, ${longitude}`);
    } catch (error) {
      Alert.alert('Error fetching location', error.message);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', passwordConfirmation);
    formData.append('phone', phone);
    formData.append('location', location);

    try {
      const response = await fetch(
        'https://leen-app.com/public/api/customer/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        Alert.alert('Success', 'Registration successful');
        
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  const handleLogin = () => {
    Alert.alert('تسجيل الدخول')
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>أكمل التسجيل</Text>

        <TextInput
          style={styles.input}
          placeholder="الاسم الأول"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="الاسم الأخير"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="البريد الإلكتروني"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="تأكيد كلمة المرور"
          secureTextEntry
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          placeholderTextColor="#666"
        />
          <TextInput
            style={styles.input}
            placeholder="الموقع"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#666"
          />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>تسجيل</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'AlmaraiBold',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E7E7E7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: '#333',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    textAlign: 'right',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationInput: {
    flex: 1,
    marginRight: 10,
  },
  locationButton: {
    backgroundColor: '#435E58',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
  },
  submitButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'AlmaraiBold',
  },
});

export default RegisterForm;