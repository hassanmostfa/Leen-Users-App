import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const bookStudioServiceApiService = createApi({
  reducerPath: 'bookStudioServiceApiService',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      try {
        const token = await AsyncStorage.getItem('authToken');
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
    // Book Studio Service
    bookStudioService: builder.mutation({
      query: (bookingData) => ({
        url: `/customer/studioServices/book`,
        method: 'POST',
        body: bookingData,
      }),
    }),

        // Cancel Home Booking
        cancelStudioBooking: builder.mutation({
          query: (bookingId) => ({
            url: `/customer/cancel/studioBooking/${bookingId}`,
            method: 'PUT',
          }),
        }),

    // Get All Studio Bookings
    getStudioBookings: builder.query({
      query: () => ({
        url: `/customer/studioServices/bookings`,
        method: 'GET',
      }),
    }),
  }),
});

// Export auto-generated hooks
export const {
  useBookStudioServiceMutation,
  useCancelStudioBookingMutation,
  useGetStudioBookingsQuery,
} = bookStudioServiceApiService;
