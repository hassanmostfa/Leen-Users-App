import { StyleSheet, TextInput, View } from 'react-native'
import React , { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Search = () => {
    const [search, setSearch] = useState('');

    return (
        <View>
        <View style={styles.searchContainer}>
            <TextInput
            style={styles.searchInput}
            placeholder="ابحثي عن الخدمات أو الصالونات..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            />
            <Icon name="magnify" size={25} color="#555" style={styles.searchIcon} />
        </View>
        </View>
    )
    }

export default Search

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginHorizontal: 15,
        marginVertical: 10,
      },
      searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        fontFamily: 'AlmaraiRegular',
        color: '#333',
        textAlign: 'right',
      },
      searchIcon: {
        marginRight: 10,
      },
})