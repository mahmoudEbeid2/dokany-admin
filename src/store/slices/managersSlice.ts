import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = `${import.meta.env.VITE_API}/admin/admins`;

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
  profile_imge?: string | null;
  name?: string; // This is a computed property for easier display
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

const getToken = () => localStorage.getItem("token");

export const fetchManagers = createAsyncThunk(
  "managers/fetchManagers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Failed to fetch admins");
      }
      const data = await response.json();
      return data.admins;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const searchManagers = createAsyncThunk(
  "managers/searchManagers",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/search?query=${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Search failed");
      }
      const data = await response.json();
      return data.admins;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const addManager = createAsyncThunk(
  "managers/addManager",
  async (managerData: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: managerData,
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: "An unexpected error occurred." });
    }
  }
);

export const updateManager = createAsyncThunk(
  "managers/updateManager",
  async (
    { id, managerData }: { id: string; managerData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: managerData,
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: "An unexpected error occurred." });
    }
  }
);

export const deleteManager = createAsyncThunk(
  "managers/deleteManager",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Failed to delete manager");
      }
      return id;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

const managersSlice = createSlice({
  name: "managers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Helper function to add computed 'name' property
    const addComputedName = (manager: Manager): Manager => ({
      ...manager,
      name: `${manager.f_name} ${manager.l_name}`,
    });

    builder
      .addCase(
        fetchManagers.fulfilled,
        (state, action: PayloadAction<Manager[]>) => {
          state.managers = action.payload.map(addComputedName);
          state.loading = false;
        }
      )
      .addCase(
        searchManagers.fulfilled,
        (state, action: PayloadAction<Manager[]>) => {
          state.managers = action.payload.map(addComputedName);
          state.loading = false;
        }
      )
      .addCase(
        addManager.fulfilled,
        (state, action: PayloadAction<Manager>) => {
          state.managers.unshift(addComputedName(action.payload));
          state.loading = false;
        }
      )
      .addCase(
        updateManager.fulfilled,
        (state, action: PayloadAction<Manager>) => {
          const index = state.managers.findIndex(
            (m) => m.id === action.payload.id
          );
          if (index !== -1) {
            state.managers[index] = addComputedName(action.payload);
          }
          state.loading = false;
        }
      )
      .addCase(
        deleteManager.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.managers = state.managers.filter(
            (m) => m.id !== action.payload
          );
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error =
            action.payload?.message || action.payload || "An error occurred";
        }
      );
  },
});

export const { clearError } = managersSlice.actions;
export default managersSlice.reducer;
