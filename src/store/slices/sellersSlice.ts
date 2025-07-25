import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Seller {
  id: string;
  fullName: string;
  email: string;
  paypalEmail: string;
  isPaid: boolean;
  createdAt: string;
}

interface SellersState {
  sellers: Seller[];
  loading: boolean;
}

const initialState: SellersState = {
  sellers: [
    {
      id: '1',
      fullName: 'John Smith',
      email: 'john@example.com',
      paypalEmail: 'john.paypal@example.com',
      isPaid: true,
      createdAt: '2025-01-01',
    },
    {
      id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      paypalEmail: 'sarah.paypal@example.com',
      isPaid: false,
      createdAt: '2025-01-02',
    },
  ],
  loading: false,
};

const sellersSlice = createSlice({
  name: 'sellers',
  initialState,
  reducers: {
    addSeller: (state, action: PayloadAction<Omit<Seller, 'id' | 'createdAt'>>) => {
      // Check for duplicate email
      const existingEmail = state.sellers.find(seller => seller.email === action.payload.email);
      if (existingEmail) {
        throw new Error('A seller with this email already exists');
      }
      
      const newSeller: Seller = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.sellers.push(newSeller);
    },
    updateSeller: (state, action: PayloadAction<Seller>) => {
      const index = state.sellers.findIndex(seller => seller.id === action.payload.id);
      if (index !== -1) {
        state.sellers[index] = action.payload;
      }
    },
    deleteSeller: (state, action: PayloadAction<string>) => {
      state.sellers = state.sellers.filter(seller => seller.id !== action.payload);
    },
    toggleSellerPayment: (state, action: PayloadAction<string>) => {
      const seller = state.sellers.find(seller => seller.id === action.payload);
      if (seller) {
        seller.isPaid = !seller.isPaid;
      }
    },
  },
});

export const { addSeller, updateSeller, deleteSeller, toggleSellerPayment } = sellersSlice.actions;
export default sellersSlice.reducer;