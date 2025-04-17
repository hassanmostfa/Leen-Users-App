import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const couponsApiService = createApi({
  reducerPath: 'couponsApiService',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      try {
        const token = await AsyncStorage.getItem('authToken'); // Get authToken from AsyncStorage
        console.log('RTK Query auth token is : ', token);    
        
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
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: `/customer/coupons/apply`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export auto-generated hooks
export const { useApplyCouponMutation } = couponsApiService;
