import { configureStore } from '@reduxjs/toolkit';
import { apiService } from '../API/shared/Customer'; // Import the API slice
import { getSubCategories } from '../API/shared/SubCategories'; // Import SubCategories API slice
import { sellersApiService } from '../API/shared/Salons'; // Import Sellers API slice
import { favouritesApiService } from '../API/Favourites';
import { getServices } from '../API/Services';
import { getActiveDays } from '../API/Timetable';
import { EmployeesApi } from '../API/Employees';
import { bookStudioServiceApiService } from '../API/shared/BookStudioService';
import { bookHomeServiceApiService } from '../API/shared/BookHomeService';
import { couponsApiService } from '../API/Coupon';
import { ratingsApiService } from '../API/Ratings';
import { reelsApiService } from '../API/Reels';
import { chatSellersApiService } from '../API/chat';
const store = configureStore({
  reducer: {
    [apiService.reducerPath]: apiService.reducer, // Register RTK Query reducer for API service
    [getSubCategories.reducerPath]: getSubCategories.reducer, // Register RTK Query reducer for SubCategories
    [sellersApiService.reducerPath]: sellersApiService.reducer, // Register RTK Query reducer for Sellers
    [favouritesApiService.reducerPath]: favouritesApiService.reducer, // Register RTK Query reducer for Favourites
    [getServices.reducerPath]: getServices.reducer, // Register RTK Query reducer for Services
    [getActiveDays.reducerPath]: getActiveDays.reducer,
    [EmployeesApi.reducerPath]: EmployeesApi.reducer,
    [bookStudioServiceApiService.reducerPath]: bookStudioServiceApiService.reducer,
    [bookHomeServiceApiService.reducerPath]: bookHomeServiceApiService.reducer,
    [couponsApiService.reducerPath]: couponsApiService.reducer,
    [ratingsApiService.reducerPath]: ratingsApiService.reducer,
    [reelsApiService.reducerPath]: reelsApiService.reducer,
    [chatSellersApiService.reducerPath]: chatSellersApiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiService.middleware,
      getSubCategories.middleware,
      sellersApiService.middleware,
      favouritesApiService.middleware,
      getServices.middleware,
      getActiveDays.middleware,
      EmployeesApi.middleware,
      bookStudioServiceApiService.middleware,
      bookHomeServiceApiService.middleware,
      couponsApiService.middleware,
      ratingsApiService.middleware,
      reelsApiService.middleware,
      chatSellersApiService.middleware,
    ), // Add middleware for RTK Query
});

export default store;
