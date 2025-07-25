import { createSlice } from '@reduxjs/toolkit';

interface AnalyticsState {
  totalSellers: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

const initialState: AnalyticsState = {
  totalSellers: 248,
  totalOrders: 1542,
  totalUsers: 8934,
  totalRevenue: 125680,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
});

export default analyticsSlice.reducer;