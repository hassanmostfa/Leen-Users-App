import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useRateServiceMutation } from '../API/Ratings'
import { showMessage } from 'react-native-flash-message'

const RateService = ({ navigation, route }) => {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const serviceId = route.params?.serviceId
  const serviceType = route.params?.serviceType
  
  const [rateService, { isLoading }] = useRateServiceMutation()
  
  const handleRating = (selectedRating) => {
    setRating(selectedRating)
  }

  const submitRating = async () => {
    if (!serviceId || !serviceType) {
      showMessage({
        message: "خطأ في البيانات",
        description: "معرف الخدمة أو نوع الخدمة غير موجود",
        type: "danger",
        icon: "auto",
        duration: 3000
      })
      return
    }

    try {
      const response = await rateService({
        service_id: serviceId,
        service_type: serviceType,
        rating: rating,
        review: feedback
      }).unwrap()

      if (response.status === "success") {
        navigation.navigate('ThankYou')
      } else {
        showMessage({
          message: "خطأ في التقييم",
          description: response.message || "فشل في إرسال التقييم",
          type: "danger",
          icon: "auto",
          duration: 3000
        })
      }
    } catch (error) {
      showMessage({
        message: "خطأ في الشبكة",
        description: "تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى",
        type: "danger",
        icon: "auto",
        duration: 3000
      })
      console.error("Rating error:", error)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-forward" size={24} color="#435E58" />
        </TouchableOpacity>
        <Text style={styles.title}>التقييم</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>قيم تجربتك</Text>
        <Text style={styles.description}>نسعى دائماً في تحسين خدماتنا من خلال تقييم تجربتك مع الخدمة.</Text>
        
        <Text style={styles.question}>كيف كانت تجربتك مع الخدمة؟</Text>
        <Text style={styles.instruction}>يمكنك الضغط على النجوم لتحديد التقييم (من 1 إلى 5)</Text>
        
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => handleRating(star)}
              disabled={isLoading}
            >
              <AntDesign 
                name={star <= rating ? 'star' : 'star'} 
                size={30} 
                color={star <= rating ? '#435E58' : '#E5E7EB'} 
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.feedbackTitle}>أخبرنا المزيد عن تجربتك</Text>
        <View style={styles.textareaContainer}>
          <TextInput
            style={styles.feedbackInput}
            multiline
            numberOfLines={6}
            placeholder="اكتب رأيك هنا..."
            placeholderTextColor="#999"
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
            textAlign="right"
            editable={!isLoading}
          />
        </View>
      </ScrollView>

      {/* Fixed button at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (rating === 0 || isLoading) && styles.disabledButton
          ]} 
          onPress={submitRating}
          disabled={rating === 0 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>إرسال التقييم</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RateService

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    textAlign: 'right',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 20,
    color: '#888888',
    fontFamily: 'AlmaraiRegular',
    lineHeight: 24,
  },
  question: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    textAlign: 'right',
    marginBottom: 5,
    color: '#333',
  },
  instruction: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 20,
    color: '#666',
    fontFamily: 'AlmaraiRegular',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
    gap: 10,
  },
  feedbackTitle: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    textAlign: 'right',
    marginBottom: 10,
    color: '#333',
  },
  textareaContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
  },
  feedbackInput: {
    minHeight: 150,
    padding: 15,
    textAlign: 'right',
    fontFamily: 'AlmaraiRegular',
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  submitButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
})