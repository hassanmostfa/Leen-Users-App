import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const ratingsApiService = createApi({
  reducerPath: 'ratingsApiService',
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
    // Fetch Salon Ratings and Reviews for a Seller
    getAllRatings: builder.query({
      query: (seller_id) => `/customer/seller/rating/${seller_id}`,
    }),
  }),
});

// Export auto-generated hooks
export const { useGetAllRatingsQuery } = ratingsApiService;
