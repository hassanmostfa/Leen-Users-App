import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const getActiveDays  = createApi({
  reducerPath: 'getActiveDays ',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch Working Days
    getActiveDays: builder.query({
      query: (seller_id) => `/seller/${seller_id}/active-weekdays`,
    }),

    // Fetch Available Times (POST request)
    getAvailableTimes: builder.mutation({
      query: ({ data }) => ({
        url: `/check-available-times`, // API URL
        method: 'POST', // Sending data via POST
        body: data, // Sending data in the request body
      }),
    }),
  }),
});

// Export the auto-generated hooks
export const { useGetActiveDaysQuery, useGetAvailableTimesMutation } = getActiveDays ;
