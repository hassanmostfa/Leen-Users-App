import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/Welcome';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import RegisterForm from './components/auth/RegisterForm';
import Home from './screens/Home';
import HomeBookings from './screens/bookings/HomeBookings';
import StudioBookings from './screens/bookings/StudioBookings';
import ShowSellerInfo from './screens/ShowSellerInfo';
import CompleteBooking from './screens/bookings/CompleteBooking';
import BookingDetails from './screens/bookings/BookingDetails';
import PaymentMethods from './screens/bookings/PaymentMethods';
import Reels from './screens/Reels';
import Receipt from './screens/bookings/Receipt';
import Profile from './screens/Profile';
import RateService from './screens/RateService';
import Thanks from './screens/ThankYou';
import Notifications from './screens/Notifications';
import Sellers from './screens/chat/Sellers';
import ChatRoom from './screens/chat/ChatRoom'
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Stack Navigator
const Stack = createNativeStackNavigator();

// Custom Toast configuration
const toastConfig = {
  success: ({ text1, text2, props }) => (
    <View style={styles.toastSuccess}>
      <Text style={styles.toastText1}>{text1}</Text>
      {text2 && <Text style={styles.toastText2}>{text2}</Text>}
    </View>
  ),
  error: ({ text1, text2, props }) => (
    <View style={styles.toastError}>
      <Text style={styles.toastText1}>{text1}</Text>
      {text2 && <Text style={styles.toastText2}>{text2}</Text>}
    </View>
  ),
  info: ({ text1, text2, props }) => (
    <View style={styles.toastInfo}>
      <Text style={styles.toastText1}>{text1}</Text>
      {text2 && <Text style={styles.toastText2}>{text2}</Text>}
    </View>
  ),
};

// Main App Component
export default function App() {
  // Fonts
  const [loaded] = useFonts({
    AlmaraiBold: require('./assets/fonts/Almarai-Bold.ttf'),
    AlmaraiExtraBold: require('./assets/fonts/Almarai-ExtraBold.ttf'),
    AlmaraiLight: require('./assets/fonts/Almarai-Light.ttf'),
    AlmaraiRegular: require('./assets/fonts/Almarai-Regular.ttf'),
  });

  // Navigation reference
  const navigationRef = React.useRef();

  // Logout function
  // const logout = async () => {
  //   try {
  //     // Remove the auth token from AsyncStorage
  //     await AsyncStorage.removeItem('authToken');
      
  //     // Navigate to the login screen
  //     navigationRef.current?.navigate('Login');
      
  //     // Show success message
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Logged out successfully',
  //     });
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Logout Error',
  //       text2: 'Failed to logout properly',
  //     });
  //   }
  // };
  // logout();

  // Example: Perform logout when component mounts
  useEffect(() => {
    // Uncomment this if you want to automatically logout on app start
    // logout();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Welcome'>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="RegisterForm" component={RegisterForm} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="HomeBookings" component={HomeBookings} />
          <Stack.Screen name="StudioBookings" component={StudioBookings} />
          <Stack.Screen name="ShowSellerInfo" component={ShowSellerInfo} />
          <Stack.Screen name="CompleteBooking" component={CompleteBooking} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
          <Stack.Screen name="Receipt" component={Receipt} />
          <Stack.Screen name="Reels" component={Reels} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="RateService" component={RateService} />
          <Stack.Screen name="ThankYou" component={Thanks} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Sellers" component={Sellers} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}

// Custom Toast styles
const styles = StyleSheet.create({
  toastSuccess: {
    width: '90%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderRightColor: '#2f3e46',
    borderRightWidth: 5,
    elevation: 4,
  },
  toastError: {
    width: '90%',
    padding: 15,
    backgroundColor: '#F44336',
    borderRadius: 10,
    borderLeftColor: '#D32F2F',
    borderLeftWidth: 5,
  },
  toastInfo: {
    width: '90%',
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    borderLeftColor: '#1976D2',
    borderLeftWidth: 5,
  },
  toastText1: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#222222',
    textAlign: 'right',
  },
  toastText2: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
    fontFamily: 'AlmaraiRegular',
    textAlign: 'right',
  },
});