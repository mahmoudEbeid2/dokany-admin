import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Manager {
  id: string;
  user_name: string;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  city: string;
  governorate: string;
  country: string;
  role: string;
  subdomain: string | null;
  payout_method: string | null;
  password: string;
  resetToken: string | null;
  resetTokenExpiresAt: string | null;
  logo: string | null;
  profile_imge: string | null;
  theme_id: string | null;
  image_public_id: string | null;
  logo_public_id: string | null;
  // Computed properties for backward compatibility
  name?: string;
  createdAt?: string;
}

interface ManagersState {
  managers: Manager[];
  loading: boolean;
  error: string | null;
}

const initialState: ManagersState = {
  managers: [],
  loading: false,
  error: null,
};

const managersSlice = createSlice({
  name: 'managers',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setManagers: (state, action: PayloadAction<Manager[]>) => {
      // Transform API data to include computed properties
      state.managers = action.payload.map(manager => ({
        ...manager,
        name: `${manager.f_name} ${manager.l_name}`,
        createdAt: new Date().toISOString().split('T')[0], // Fallback since API doesn't provide this
      }));
    },
    addManager: (state, action: PayloadAction<Omit<Manager, 'id' | 'createdAt'>>) => {
      // Check for duplicate email
      const existingEmail = state.managers.find(manager => manager.email === action.payload.email);
      if (existingEmail) {
        throw new Error('A manager with this email already exists');
      }
      
      // Check for duplicate username
      if (action.payload.user_name) {
        const existingUsername = state.managers.find(manager => manager.user_name === action.payload.user_name);
        if (existingUsername) {
          throw new Error('A manager with this username already exists');
        }
      }
      
      const newManager: Manager = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      // Add new manager at the beginning of the list
      state.managers.unshift(newManager);
    },
    addManagerToFront: (state, action: PayloadAction<Manager>) => {
      // Add new manager from API at the beginning of the list
      const managerWithComputed = {
        ...action.payload,
        name: `${action.payload.f_name} ${action.payload.l_name}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.managers.unshift(managerWithComputed);
    },
    updateManager: (state, action: PayloadAction<{ id: string; data: Partial<Omit<Manager, 'id' | 'createdAt'>> | Manager }>) => {
      const { id, data } = action.payload;
      const managerIndex = state.managers.findIndex(manager => manager.id === id);
      
      if (managerIndex !== -1) {
        // If data is a complete Manager object from API response
        if ('id' in data && data.id === id) {
          // Replace the entire manager with API response
          state.managers[managerIndex] = {
            ...data,
            name: `${data.f_name} ${data.l_name}`,
            createdAt: state.managers[managerIndex].createdAt, // Keep existing createdAt
          };
        } else {
          // Check for duplicate email if email is being updated
          if (data.email) {
            const existingEmail = state.managers.find(manager => 
              manager.email === data.email && manager.id !== id
            );
            if (existingEmail) {
              throw new Error('A manager with this email already exists');
            }
          }
          
          // Check for duplicate username if username is being updated
          if (data.user_name) {
            const existingUsername = state.managers.find(manager => 
              manager.user_name === data.user_name && manager.id !== id
            );
            if (existingUsername) {
              throw new Error('A manager with this username already exists');
            }
          }
          
          // Update partial data
          state.managers[managerIndex] = {
            ...state.managers[managerIndex],
            ...data,
          };
        }
      }
    },
    deleteManager: (state, action: PayloadAction<string>) => {
      state.managers = state.managers.filter(manager => manager.id !== action.payload);
    },
  },
});

export const { setLoading, setError, setManagers, addManager, addManagerToFront, updateManager, deleteManager } = managersSlice.actions;
export default managersSlice.reducer;