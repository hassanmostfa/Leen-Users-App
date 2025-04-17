import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGetActiveDaysQuery } from '../../API/Timetable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Timetable = ({ navigation, seller_id }) => {
  const { data, isLoading, error } = useGetActiveDaysQuery(seller_id)
  const activeDays = data?.data || []

  const weekDays = [
    { key: 'Saturday', arabic: 'السبت' },
    { key: 'Sunday', arabic: 'الأحد' },
    { key: 'Monday', arabic: 'الإثنين' },
    { key: 'Tuesday', arabic: 'الثلاثاء' },
    { key: 'Wednesday', arabic: 'الأربعاء' },
    { key: 'Thursday', arabic: 'الخميس' },
    { key: 'Friday', arabic: 'الجمعة' },
  ]

  const findDayData = (dayKey) =>
    activeDays.find((day) => day.day === dayKey)

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading timetable...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error loading timetable</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {weekDays.map((day) => {
        const dayData = findDayData(day.key)
        const isActive = !!dayData

        return (
          <View
            key={day.key}
            style={[styles.dayRow, !isActive && styles.inactiveRow]}
          >
            <Icon
              name="checkbox-blank-circle"
              size={16}
              color={isActive ? '#76D44A' : '#E7E7E7'} // green if open, red if closed
              style={styles.icon}
            />
            <Text style={[styles.dayText, !isActive && styles.inactiveText]}>
              {day.arabic}
            </Text>
            {isActive ? (
              <Text style={styles.timeText}>
                {dayData.start_time.slice(0, 5)} - {dayData.end_time.slice(0, 5)}
              </Text>
            ) : (
              <Text style={styles.closedText}>مغلق</Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

export default Timetable

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  inactiveRow: {
    opacity: 0.8,
  },
  dayText: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'AlmaraiRegular',
  },
  inactiveText: {
    color: '#6D6D6D',
  },
  icon: {
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'AlmaraiRegular',
  },
  closedText: {
    fontSize: 14,
    color: '#6D6D6D',
    fontFamily: 'AlmaraiRegular',
  },
})
