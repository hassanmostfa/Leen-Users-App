import { StyleSheet, Text, View , FlatList , Image , ActivityIndicator , SafeAreaView} from 'react-native'
import React from 'react'
import { useGetSubCategoriesQuery } from '../../API/shared/SubCategories'; // Import the hook

const SubCategories = () => {
    const { data: subCategories, error, isLoading } = useGetSubCategoriesQuery();
return (
    <SafeAreaView>
    <View style={styles.subCategoriesSection}>
        <Text style={styles.subCategoriesTitle}>الخدمات</Text>

        {/* Display Loading State */}
        {isLoading ? (
        <ActivityIndicator size="large" color="#2f3e3b" />
        ) : error ? (
        <Text style={styles.errorText}>حدث خطأ أثناء تحميل البيانات.</Text> // Handle error state
        ) : (
        // Render subcategories if data is available
        subCategories.data && subCategories.data.length > 0 ? (
            <FlatList
            data={subCategories.data}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            renderItem={({ item }) => (
                <View style={styles.subCategoryItem}>
                <Image 
                    source={{ uri: `https://leen-app.com/public/${item.image}` }} 
                    style={styles.subCategoryImage} 
                />
                <Text style={styles.subCategoryName}>{item.name}</Text>
                </View>
            )}
            />
        ) : (
            <Text style={styles.noSubCategoriesText}>لا توجد خدمات متاحة حالياً.</Text> // No data found
        )
        )}
    </View>
    </SafeAreaView>
)
}

export default SubCategories

const styles = StyleSheet.create({
    subCategoriesSection: {
        paddingHorizontal: 15,
        marginTop: 20,
        },
        subCategoriesTitle: {
        fontSize: 16,
        color: '#222222',
        fontFamily: 'AlmaraiBold',
        marginBottom: 15,
        },
        subCategoryItem: {
        marginRight: 20,
        alignItems: 'center',
        },
        subCategoryImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        resizeMode: 'cover',
        },
        subCategoryName: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
        fontFamily: 'AlmaraiRegular',
        },
        errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        },
        noSubCategoriesText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        },
})