import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Manager {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ManagersState {
  managers: Manager[];
  loading: boolean;
}

const initialState: ManagersState = {
  managers: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      createdAt: '2025-01-01',
    },
  ],
  loading: false,
};

const managersSlice = createSlice({
  name: 'managers',
  initialState,
  reducers: {
    addManager: (state, action: PayloadAction<Omit<Manager, 'id' | 'createdAt'>>) => {
      // Check for duplicate email
      const existingEmail = state.managers.find(manager => manager.email === action.payload.email);
      if (existingEmail) {
        throw new Error('A manager with this email already exists');
      }
      
      const newManager: Manager = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.managers.push(newManager);
    },
    deleteManager: (state, action: PayloadAction<string>) => {
      state.managers = state.managers.filter(manager => manager.id !== action.payload);
    },
  },
});

export const { addManager, deleteManager } = managersSlice.actions;
export default managersSlice.reducer;