import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React from 'react'
import { useGetSellerEmployeesQuery } from '../../API/Employees'
import ManImg from '../../assets/images/avatars/man.png'

const Employees = ({ seller_id }) => {
  const { data, isLoading, error } = useGetSellerEmployeesQuery(seller_id)
  const Employees = data?.data || []

  console.log('Employees Data:', Employees)

  if (isLoading) {
    return (
      <View>
        <Text>Loading employees...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View>
        <Text>Error loading employees</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Image source={ManImg} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.position}>{item.position}</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  )
}

export default Employees

const styles = StyleSheet.create({
  container: {
    flex: 1, // This ensures the container takes all available space
    paddingTop: 10,
  },
  listContentContainer: {
    paddingBottom: 20, // Add some padding at the bottom if needed
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25,
  },
  name: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  position: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'AlmaraiRegular',
  },
})