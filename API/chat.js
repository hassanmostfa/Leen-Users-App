import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service for Chat Sellers
export const chatSellersApiService = createApi({
  reducerPath: 'chatSellersApiService',
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
    // Fetch All Sellers for Chat
    getAllChatSellers: builder.query({
      query: () => '/chat/sellers', // <-- Your API endpoint for getting sellers
    }),
  }),
});

// Export auto-generated hook
export const { useGetAllChatSellersQuery } = chatSellersApiService;
