// API/SubCategories.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query for SubCategories
export const getServices = createApi({
  reducerPath: 'getServices',
  baseQuery: fetchBaseQuery({
    baseUrl,
    // No need to set the Authorization header anymore
    prepareHeaders: (headers) => {
      // Return the headers without the Authorization token
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch Home Services
    getHomeServices: builder.query({
      query: (seller_id) => `/customer/seller/homeServices/${seller_id}`, // Corrected dynamic seller_id
    }),

    // Fetch Home Services
    getStudioServices: builder.query({
      query: (seller_id) => `/customer/seller/studioServices/${seller_id}`, // Corrected dynamic seller_id
    }),
  }),
});

// Export the auto-generated hook for fetching subcategories
export const { useGetHomeServicesQuery , useGetStudioServicesQuery } = getServices;
