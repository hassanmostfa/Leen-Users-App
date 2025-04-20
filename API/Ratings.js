import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'https://leen-app.com/public/api';

export const ratingsApiService = createApi({
  reducerPath: 'ratingsApiService',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      try {
        const token = await AsyncStorage.getItem('authToken');
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
    // GET: Fetch all ratings for a seller
    getAllRatings: builder.query({
      query: (seller_id) => `/customer/seller/rating/${seller_id}`,
    }),

    // POST: Rate a service
    rateService: builder.mutation({
      query: (ratingData) => ({
        url: '/customer/rate/service', // adjust the endpoint as needed
        method: 'POST',
        body: ratingData,
      }),
    }),
  }),
});

export const { useGetAllRatingsQuery, useRateServiceMutation } = ratingsApiService;
