import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useGetAllRatingsQuery } from '../../API/Ratings'
import moment from 'moment'

// Set moment locale to Arabic
moment.locale('ar')

const Ratings = ({ seller_id }) => {
  const { data, isLoading, isError } = useGetAllRatingsQuery(seller_id)

  if (isLoading) {
    return <Text style={styles.loading}>جاري التحميل...</Text>
  }

  if (isError || !data) {
    return <Text style={styles.error}>حدث خطأ أثناء تحميل التقييمات</Text>
  }

  const { average_rating, ratings_count, data: ratings } = data

  const renderStars = (count) => {
    const filled = Math.floor(count)
    const half = count - filled >= 0.5
    const empty = 5 - filled - (half ? 1 : 0)

    return (
      <View style={styles.stars}>
        {Array(filled)
          .fill()
          .map((_, i) => (
            <Icon key={`full-${i}`} name="star" size={16} color="#FFD700" />
          ))}
        {half && <Icon name="star-half-full" size={16} color="#FFD700" />}
        {Array(empty)
          .fill()
          .map((_, i) => (
            <Icon key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
          ))}
      </View>
    )
  }

  const renderItem = ({ item }) => {
    const customerName = `${item.customer.first_name} ${item.customer.last_name}`
    const firstLetter = item.customer.first_name?.charAt(0) || 'م'

    // Format date and time in Arabic as "15 ديسمبر 2024 الساعة 1:05 ص"
    const dateTime = moment(item.created_at).format('DD MMMM YYYY [الساعة] h:mm A')

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>{firstLetter}</Text>
          </View>
          <View style={styles.reviewerInfo}>
            <Text style={styles.name}>{customerName}</Text>
            <Text style={styles.date}>{dateTime}</Text>
          </View>
        </View>

        <View style={styles.reviewStars}>
          {renderStars(item.rating)}
        </View>

        {item.review && (
          <Text style={styles.reviewText}>{item.review}</Text>
        )}
      </View>
    )
  }

  return (
    <FlatList
      data={ratings}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}  // Hide the vertical scrollbar
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>التقييمات</Text>

          <View style={styles.topRow}>
            {renderStars(average_rating)}
            <Text style={styles.avgRatingText}>
              ({ratings_count}) 
                <Text style={{ color: '#222' , fontFamily: 'AlmaraiBold' }}>{average_rating.toFixed(1)} </Text>
            </Text>
          </View>
        </View>
      }
      contentContainerStyle={{ paddingTop: 10 }}
    />
  )
}

export default Ratings

const styles = StyleSheet.create({
  loading: {
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'AlmaraiRegular',
  },
  topRow: {
    flexDirection: 'column',
    gap: 8,
  },
  avgRatingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
  },
  stars: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  circle: {
    width: 50,
    height: 50,
    backgroundColor: '#DFE8E5',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 18,
    color: '#435E58',
    fontFamily: 'AlmaraiBold',
  },
  reviewerInfo: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  date: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'AlmaraiRegular',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#333',
    lineHeight: 20,
  },
  header: {
    padding: 16,
  },
})
