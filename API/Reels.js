import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const reelsApiService = createApi({
  reducerPath: 'reelsApiService',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //Fetch All Reels
    getAllReels: builder.query({
      query: () => '/reels',
    }),
  }),
});

// Export auto-generated hooks
export const { useGetAllReelsQuery } = reelsApiService;
