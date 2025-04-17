import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
// Extend your existing API service
export const bookHomeServiceApiService = createApi({
  reducerPath: 'bookHomeServiceApiService',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      try {
        const token = await AsyncStorage.getItem('authToken'); // Get authToken from AsyncStorage
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        } else {
          console.warn('No auth token found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Book Home Service
    bookHomeService: builder.mutation({
      query: (bookingData) => ({
        url: `/customer/homeServices/book`,
        method: 'POST',
        body: bookingData,
      }),
    }),

    // Get All Home Bookings
    getHomeBookings: builder.query({
      query: () => ({
        url: `/customer/homeServices/bookings`,
        method: 'GET',
      }),
    }),
  }),
});

// Export auto-generated hooks
export const {
  useBookHomeServiceMutation,
  useGetHomeBookingsQuery,
} = bookHomeServiceApiService;
