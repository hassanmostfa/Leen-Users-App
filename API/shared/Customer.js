import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const apiService = createApi({
  reducerPath: 'apiService',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      try {
        const token = await AsyncStorage.getItem('authToken'); // Get authToken from AsyncStorage
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch customer info
    getCustomerInfo: builder.query({
      query: () => '/customer/info',
    }),
  }),
});

// Export auto-generated hook
export const { useGetCustomerInfoQuery } = apiService;
