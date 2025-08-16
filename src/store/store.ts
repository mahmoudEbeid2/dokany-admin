import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import sellersSlice from './slices/sellersSlice';
import managersSlice from './slices/managersSlice';
import themesSlice from './slices/themesSlice';
import analyticsSlice from './slices/analyticsSlice';
import campaignsSlice from './slices/campaignsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    sellers: sellersSlice,
    managers: managersSlice,
    themes: themesSlice,
    analytics: analyticsSlice,
    campaigns: campaignsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;