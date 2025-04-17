import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API base URL
const baseUrl = 'https://leen-app.com/public/api';

// Create an API service using RTK Query
export const EmployeesApi = createApi({
  reducerPath: 'EmployeesApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBusyEmployees: builder.mutation({
      query: ({ data }) => ({
        url: `/check-employee-availability`, // API URL
        method: 'POST',
        body: data,
      }),
    }),
    getSellerEmployees: builder.query({
      query: (seller_id) => `/seller/${seller_id}/employees`, // Dynamic sellerId
    }),
  }),
});

// Export the auto-generated hooks
export const { useGetBusyEmployeesMutation, useGetSellerEmployeesQuery } = EmployeesApi;
