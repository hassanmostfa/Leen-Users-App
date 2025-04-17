// API/SubCategories.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query for SubCategories
export const getSubCategories = createApi({
  reducerPath: 'getSubCategories',
  baseQuery: fetchBaseQuery({
    baseUrl,
    // No need to set the Authorization header anymore
    prepareHeaders: (headers) => {
      // Return the headers without the Authorization token
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch subcategories
    getSubCategories: builder.query({
      query: () => '/subCategories', // API endpoint for subcategories
    }),
  }),
});

// Export the auto-generated hook for fetching subcategories
export const { useGetSubCategoriesQuery } = getSubCategories;
