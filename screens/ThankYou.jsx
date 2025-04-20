import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import ThanksVector from '../assets/thanks.png'

const ThankYou = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-forward" size={24} color="#435E58" />
        </TouchableOpacity>
        <Text style={styles.title}>شكرًا علي تقييمك</Text>
        </View>
      <View style={styles.content}>
        <Image source={ThanksVector} style={styles.image} />
        
        <Text style={styles.message}>شكرًا لتقييمك!</Text>
        
        <Text style={styles.description}>
        رأيك يهمنا ويساعدنا على تحسين خدماتنا لنقدم 
        لك الأفضل دائمًا.
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>العودة إلى الصفحة الرئيسية</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ThankYou

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    position: 'absolute',
    right: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
    textAlign: 'center',
    color: '#435E58',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 283,
    height: 189,
    marginBottom: 30,
  },
  message: {
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
})