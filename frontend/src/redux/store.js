import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import servicesSlice from './servicesSlice'
import staffSlice from './staffSlice'
import orderSlice from './orderSlice'
import favoriteSlice from './favSlice'
export const store=configureStore({
    reducer:{
      auth:authSlice,
      services:servicesSlice,
      staffs:staffSlice,
      orders:orderSlice,
      favorite:favoriteSlice
    }
    
})