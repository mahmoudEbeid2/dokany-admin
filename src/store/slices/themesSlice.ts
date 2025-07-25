import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Theme {
  id: string;
  name: string;
  preview_image: string;
  image_public_id: string;
}

interface ThemesState {
  themes: Theme[];
  loading: boolean;
  error: string | null;
}

const API_URL = 'https://dokany-api-production.up.railway.app/themes';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZGphbXdoeTAwMDBiNmZkNHBsMTJ5c3AiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTM0NzY1MjAsImV4cCI6MTc1NDA4MTMyMH0.KvCGcvcdl22xcN98AttbeNRYs34JjNSTmsuzNPFVGcQ';

export const fetchThemes = createAsyncThunk('themes/fetchThemes', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch themes');
  }
});

export const addThemeAsync = createAsyncThunk('themes/addTheme', async (formData: FormData, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, formData, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add theme');
  }
});

export const editThemeAsync = createAsyncThunk('themes/editTheme', async ({ id, data }: { id: string, data: FormData }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to edit theme');
  }
});

export const deleteThemeAsync = createAsyncThunk('themes/deleteTheme', async (id: string, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete theme');
  }
});

const initialState: ThemesState = {
  themes: [],
  loading: false,
  error: null,
};

const themesSlice = createSlice({
  name: 'themes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchThemes
      .addCase(fetchThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemes.fulfilled, (state, action: PayloadAction<Theme[]>) => {
        state.loading = false;
        state.themes = action.payload;
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // addThemeAsync
      .addCase(addThemeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addThemeAsync.fulfilled, (state, action: PayloadAction<Theme>) => {
        state.loading = false;
        state.themes.push(action.payload);
      })
      .addCase(addThemeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // editThemeAsync
      .addCase(editThemeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editThemeAsync.fulfilled, (state, action: PayloadAction<Theme>) => {
        state.loading = false;
        state.themes = state.themes.map((t) => (t.id === action.payload.id ? action.payload : t));
      })
      .addCase(editThemeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteThemeAsync
      .addCase(deleteThemeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteThemeAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.themes = state.themes.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteThemeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default themesSlice.reducer;