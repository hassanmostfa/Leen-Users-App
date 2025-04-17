import React, { useState , useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    image: require('../assets/leen logo2.png'), // Replace with your image
    statusBarStyle: 'light-content', // StatusBar style for the first screen
    statusBarColor: '#2f3e3b', // StatusBar background color for the first screen
  },
  {
    id: 2,
    title: 'مرحبًا بك في تطبيق لين!',
    description: 
    'استمتعي بخدمات تجميل مخصصة لكِ، في المنزل أو في الصالونات القريبة.',
    background: require('../assets/images/welcome-1.png'), // Replace with your image
    statusBarStyle: 'light-content', // StatusBar style for the second screen
    statusBarColor: 'transparent', // StatusBar background color for the second screen
  },
  {
    id: 3,
    title: 'استكشفي الخدمات القريبة بسهولة',
    description: 'اكتشفي الصالونات القريبة واحجزي خدمتك المفضلة بكل سهولة.', 
    background: require('../assets/images/welcome-2.png'), // Replace with your image
    statusBarStyle: 'light-content', // StatusBar style for the third screen
    statusBarColor: 'transparent', // StatusBar background color for the third screen
  },
  {
    id: 4,
    title: 'حجز المواعيد بكل سهولة',
    description: 'اختاري الخدمة، الوقت، والمكان الذي يناسبكِ، واستمتعي بالتجربة.', 
    background: require('../assets/images/welcome-3.png'), // Replace with your image
    statusBarStyle: 'light-content', // StatusBar style for the fourth screen
    statusBarColor: 'transparent', // StatusBar background color for the fourth screen
  },
];

const Welcome = ({ navigation }) => {

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        navigation.replace('Home'); // Navigate to Home if token exists
      }
    };
    checkToken();
  }, [navigation]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIndicators, setShowIndicators] = useState(false);

     const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Login'); // Navigate to Login after the last screen
    }
  };

  const handleScreenPress = () => {
    if (currentIndex === 0) {
      setShowIndicators(true); // Show indicators and next button after the first screen
      setCurrentIndex(1); // Move to the second screen
    }
  };

  // Get the current screen's StatusBar style and background color
  const currentScreen = onboardingData[currentIndex];
  const statusBarStyle = currentScreen.statusBarStyle;
  const statusBarColor = currentScreen.statusBarColor;

  return (
    <SafeAreaView style={styles.container}>
      {/* Dynamic StatusBar */}
      <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarColor} translucent={statusBarColor === 'transparent'} />

      {/* First Screen */}
      {currentIndex === 0 && (
        <TouchableOpacity
          style={styles.firstScreenContainer}
          activeOpacity={1}
          onPress={handleScreenPress}
        >
          <Image source={onboardingData[0].image} style={styles.logo} />
          <Text style={styles.welcomeText}>{onboardingData[0].title}</Text>
        </TouchableOpacity>
      )}

      {/* Onboarding Screens with Background Image */}
      {currentIndex > 0 && (
        <ImageBackground
          source={onboardingData[currentIndex].background}
          style={styles.backgroundImage}
        >
          {/* Dark Overlay */}
          <View style={styles.overlay} />

          {/* White Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{onboardingData[currentIndex].title}</Text>
            <Text style={styles.cardDescription}>
              {onboardingData[currentIndex].description}
            </Text>

            {/* Next Button */}
            <Pressable style={styles.button} onPress={handleNext}>
              <Icon name="arrow-left" size={24} color="#fff" />
              <Text style={styles.buttonText}>
                {currentIndex === onboardingData.length - 1 ? 'ابدئي الان' : 'التالي'}
              </Text>
            </Pressable>

            {/* Bullets (Indicators) - RTL */}
            <View style={styles.bulletsContainer}>
              {onboardingData.slice(1).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.bullet,
                    currentIndex === index + 1 && styles.activeBullet,
                  ]}
                />
              ))}
            </View>
          </View>
        </ImageBackground>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f3e3b',
  },
  firstScreenContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2f3e3b',
  },
  logo: {
    width: 150,
    height: 170,
    resizeMode: 'contain',
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'AlmaraiBold',
  },
  backgroundImage: {
    flex: 1,
    width,
    height,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 34, 34, 0.32)', // Dark overlay
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'AlmaraiBold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 15,
    color: 'rgba(109, 109, 109, 1)',
    textAlign: 'center',
    fontFamily: 'AlmaraiRegular',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#435E58',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'AlmaraiRegular',
    marginLeft: 10,
  },
  bulletsContainer: {
    flexDirection: 'row-reverse', // RTL for bullets
    justifyContent: 'center',
    alignItems: 'center',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(231, 231, 231, 1)',
    marginHorizontal: 5,
  },
  activeBullet: {
    backgroundColor: '#2f3e3b',
  },
});

export default Welcome;