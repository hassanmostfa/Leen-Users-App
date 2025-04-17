import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, StatusBar, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ManImg from '../../assets/images/avatars/man.png';
import { useGetActiveDaysQuery, useGetAvailableTimesMutation } from '../../API/Timetable';
import { useGetBusyEmployeesMutation } from '../../API/Employees';

const CompleteBooking = ({ route, navigation }) => {
  const { selectedService, service_type } = route.params;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [busyEmployees, setBusyEmployees] = useState([]);

  const { data: activeDaysData, isLoading, error } = useGetActiveDaysQuery(selectedService.seller.id);
  
  // Extract just the day names from the active days data
  const activeDays = activeDaysData?.data?.map(day => day.day) || [];
  console.log("Active Days:", activeDays); // This will now be ["Sunday", "Monday", etc.]

  const [getAvailableTimes, { isLoading: isFetching }] = useGetAvailableTimesMutation();
  const [getBusyEmployees] = useGetBusyEmployeesMutation();

  // Fetch available times when selectedDate changes
  useEffect(() => {
    console.log('Selected Date Updated:', selectedDate);
    if (selectedDate) {
      checkAvailableTimes();
    }
  }, [selectedDate]);

  // Fetch available times for the selected date
  const checkAvailableTimes = async () => {
    if (!selectedDate) {
      console.error('Selected date is null');
      return;
    }

    try {
      const response = await getAvailableTimes({
        data: { seller_id: selectedService.seller.id, date: selectedDate.toISOString().split('T')[0] },
      });
      setAvailableTimes(response.data?.availableTimes || []);
    } catch (err) {
      console.error('Error fetching available times:', err);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    console.log('Selected Date:', date);
    if (!date) {
      console.error('Invalid date selected');
      return;
    }
    setSelectedDate(date);
    setModalVisible(false);
  };

  // Handle time selection
  const handleTimeSelect = async (time) => {
    console.log('Selected Time:', time);
    setSelectedTime(time);
    await fetchBusyEmployees();
  };

  // Fetch busy employees for the selected date and time
  const fetchBusyEmployees = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    try {
      const response = await getBusyEmployees({
        data: {
          date: selectedDate.toISOString().split('T')[0],
          start_time: selectedTime,
          seller_id: selectedService.seller.id,
        },
      });
      setBusyEmployees(response.data?.['busyEmployees at this time'] || []);
    } catch (err) {
      console.error('Error fetching busy employees:', err);
    }
  };

  // Format time to "10:00 صباحًا" or "10:00 مساءً"
  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const parsedHour = parseInt(hour, 10);
    const period = parsedHour >= 12 ? 'مساءً' : 'صباحًا';
    const formattedHour = parsedHour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  // Get the next 7 days starting from today
  const getNextDays = (count) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Get all active days of the year starting from today
  const getAllActiveDays = () => {
    const activeDates = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (isDateActive(date)) {
        activeDates.push(date);
      }
    }
    return activeDates;
  };

  // Check if a date's day is active
  const isDateActive = (date) => {
    if (!activeDays || activeDays.length === 0) return false;

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return activeDays.includes(dayOfWeek);
  };

  // Check if an employee is busy
  const isEmployeeBusy = (employeeId) => {
    return busyEmployees.includes(employeeId);
  };

  // Group dates by month
  const groupDatesByMonth = (dates) => {
    const grouped = {};
    dates.forEach((date) => {
      const month = date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(date);
    });
    return grouped;
  };

  const allActiveDays = getAllActiveDays();
  const groupedDates = groupDatesByMonth(allActiveDays);

  // Page 1: Service Details
  const renderServiceDetailsPage = () => (
    <View style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>التاريخ والوقت</Text>
      </View>

      <Text style={styles.detailLabel}>حدد التاريخ</Text>

      <View style={styles.content}>
        <View style={styles.datesContainer}>
          {getNextDays(7).map((date, index) => {
            if (!isDateActive(date)) return null;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  selectedDate?.toDateString() === date.toDateString() && styles.selectedDateCard,
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={styles.dayNameText}>{date.toLocaleDateString('ar-EG', { weekday: 'long' })}</Text>
                <Text style={styles.dateText}>{date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric' })}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.dateCard} onPress={() => setModalVisible(true)}>
          <Text style={styles.dateText}>
            <Icon name="calendar-month-outline" size={24} color="#222222" />
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 24, color: '#222222', fontFamily: 'AlmaraiBold' }}>مزيد من التواريخ</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>حدد الوقت</Text>
          {isFetching ? (
            <Text style={{ fontFamily: 'AlmaraiRegular', fontSize: 16 }}>جارٍ تحميل الأوقات المتاحة...</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.timesScrollContainer}>
              <View style={styles.timesContainer}>
                {availableTimes?.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeCard,
                      selectedTime === time && styles.selectedTimeCard,
                    ]}
                    onPress={() => handleTimeSelect(time)}
                  >
                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>اختر تاريخ</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.keys(groupedDates).map((month) => (
                <View key={month}>
                  <Text style={styles.monthHeader}>{month}</Text>
                  <View style={styles.modalDatesContainer}>
                    {groupedDates[month].map((date, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dateCard,
                          selectedDate?.toDateString() === date.toDateString() && styles.selectedDateCard,
                        ]}
                        onPress={() => handleDateSelect(date)}
                      >
                        <Text style={styles.dayNameText}>{date.toLocaleDateString('ar-EG', { weekday: 'long' })}</Text>
                        <Text style={styles.dateText}>{date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric' })}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  // Page 2: Employees List
  const renderEmployeesPage = () => (
    <View style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentPage(1)}>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>اختر المختص الخاص بك</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {selectedService.employees.map((employee, index) => {
          const isBusy = isEmployeeBusy(employee.id);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.employeeCard,
                selectedEmployee?.id === employee.id && styles.selectedEmployeeCard,
                isBusy && styles.disabledEmployeeCard,
              ]}
              onPress={() => !isBusy && setSelectedEmployee(employee)}
              disabled={isBusy}
            >
              <Image source={ManImg} style={styles.employeeImage} />
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{employee.name}</Text>
                <Text style={styles.employeePosition}>{employee.position || 'مختص'}</Text>
                {isBusy && <Text style={styles.unavailableText}>غير متاح</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, (!selectedEmployee || !selectedDate || !selectedTime) && styles.disabledButton]}
        onPress={() => navigation.navigate('BookingDetails', { selectedService, selectedEmployee, selectedDate, selectedTime, service_type })}
        disabled={!selectedEmployee || !selectedDate || !selectedTime}
      >
        <Text style={styles.confirmButtonText}>تأكيد الموعد</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      {currentPage === 1 ? renderServiceDetailsPage() : renderEmployeesPage()}

      {currentPage === 1 && (
        <TouchableOpacity
          style={[styles.nextButton, (!selectedDate || !selectedTime) && styles.disabledButton]}
          onPress={() => setCurrentPage(2)}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={styles.nextButtonText}>حدد & استمر</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    direction: 'rtl',
  },
  pageContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    textAlign: 'right',
    marginLeft: 10,
  },
  content: {
    paddingBottom: 20,
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  modalDatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  selectedDateCard: {
    borderWidth: 2,
    borderColor: '#435E58',
    backgroundColor: '#E7F0ED',
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'AlmaraiBold',
    color: '#000',
    textAlign: 'center',
  },
  dayNameText: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#555',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 60,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  monthHeader: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    color: '#000',
    marginVertical: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#435E58',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 100,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  selectedEmployeeCard: {
    borderWidth: 2,
    borderColor: '#435E58',
  },
  disabledEmployeeCard: {
    opacity: 0.5,
  },
  employeeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  employeePosition: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#555',
  },
  unavailableText: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: 'red',
  },
  detailCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    marginBottom: 10,
  },
  timesScrollContainer: {
    maxHeight: 400,
  },
  timesContainer: {
    flexDirection: 'column',
  },
  timeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    width: '100%',
  },
  selectedTimeCard: {
    borderWidth: 2,
    borderColor: '#435E58',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#000',
    textAlign: 'left',
  },
  nextButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'AlmaraiRegular',
  },
  confirmButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'AlmaraiRegular',
  },
});

export default CompleteBooking;