import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const favouritesApiService = createApi({
  reducerPath: 'favouritesApiService',
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
    // Fetch All Favourites
    getAllFavourites: builder.query({
      query: () => '/customer/favourites',
    }),

    // Add to Favourites
    addToFavourites: builder.mutation({
      query: (sellerId) => ({
        url: `/customer/favourites/store/${sellerId}`,
        method: 'POST',
      }),
    }),


    // Remove from Favourites
    removeFromFavourites: builder.mutation({
      query: (favouriteId) => ({
        url: `/customer/favourites/destroy/${favouriteId}`,
        method: 'DELETE',
      }),
    }),


  }),
});

// Export auto-generated hooks
export const { useGetAllFavouritesQuery, useAddToFavouritesMutation , useRemoveFromFavouritesMutation } = favouritesApiService;
