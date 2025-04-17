import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const sellersApiService = createApi({
  reducerPath: 'sellersApiService',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    // Fetch all sellers
    getSellers: builder.query({
      query: () => '/sellers',
    }),
  }),
});

// Export auto-generated hook
export const { useGetSellersQuery } = sellersApiService;
