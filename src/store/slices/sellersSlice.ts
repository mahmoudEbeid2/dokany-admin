import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";

const API_URL = `${import.meta.env.VITE_API}/admin/sellers`;

export interface Seller {
  id: string;
  user_name: string;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  city: string;
  governorate: string;
  country: string;
  subdomain?: string;
  payout_method?: string;
  theme_id?: string;
  profile_imge?: string;
  logo?: string;
}

interface SellersState {
  sellers: Seller[];
  selectedSeller: Seller | null;
  loading: boolean;
  error: string | null;
}

const initialState: SellersState = {
  sellers: [],
  selectedSeller: null,
  loading: false,
  error: null,
};

// FIX: Changed to get the token from localStorage
const getToken = () => localStorage.getItem("token");

export const fetchSellers = createAsyncThunk(
  "sellers/fetchSellers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Failed to fetch sellers");
      }
      const data = await response.json();
      return data.sellers;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown network error occurred.");
    }
  }
);

export const fetchSellerById = createAsyncThunk(
  "sellers/fetchSellerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Failed to fetch seller");
      }
      const data = await response.json();
      return data.seller;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown network error occurred.");
    }
  }
);

export const searchSellers = createAsyncThunk(
  "sellers/searchSellers",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/admin/sellers/search?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Search failed");
      }
      const data = await response.json();
      return data.sellers || data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown network error occurred.");
    }
  }
);

export const addSeller = createAsyncThunk(
  "sellers/addSeller",
  async (sellerData: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: sellerData,
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      }
      return rejectWithValue({ message: "An unknown network error occurred." });
    }
  }
);

export const updateSeller = createAsyncThunk(
  "sellers/updateSeller",
  async (
    { id, sellerData }: { id: string; sellerData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: sellerData,
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err);
      }
      const data = await response.json();
      return data.seller;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      }
      return rejectWithValue({ message: "An unknown network error occurred." });
    }
  }
);

export const deleteSeller = createAsyncThunk(
  "sellers/deleteSeller",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Failed to delete seller");
      }
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown network error occurred.");
    }
  }
);

const sellersSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<SellersState>) => {
    builder
      .addCase(
        fetchSellers.fulfilled,
        (state, action: PayloadAction<Seller[]>) => {
          state.sellers = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        addSeller.fulfilled,
        (state, action: PayloadAction<{ seller: Seller }>) => {
          state.sellers.push(action.payload.seller);
          state.loading = false;
        }
      )
      .addCase(
        updateSeller.fulfilled,
        (state, action: PayloadAction<Seller>) => {
          const index = state.sellers.findIndex(
            (seller) => seller.id === action.payload.id
          );
          if (index !== -1) {
            state.sellers[index] = action.payload;
          }
          state.loading = false;
        }
      )
      .addCase(
        deleteSeller.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.sellers = state.sellers.filter(
            (seller) => seller.id !== action.payload
          );
          state.loading = false;
        }
      )
      .addCase(
        fetchSellerById.fulfilled,
        (state, action: PayloadAction<Seller>) => {
          state.selectedSeller = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        searchSellers.fulfilled,
        (state, action: PayloadAction<Seller[]>) => {
          state.sellers = action.payload;
          state.loading = false;
        }
      )
      .addMatcher(
        (action: PayloadAction) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action: PayloadAction) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          if (
            action.type.includes("fetchSellers") ||
            action.type.includes("searchSellers")
          ) {
            state.error =
              action.payload || "An error occurred while fetching data.";
          }
        }
      );
  },
});

export const { clearError } = sellersSlice.actions;
export default sellersSlice.reducer;
