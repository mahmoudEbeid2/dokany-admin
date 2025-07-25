import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Theme {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

interface ThemesState {
  themes: Theme[];
  loading: boolean;
}

const initialState: ThemesState = {
  themes: [
    {
      id: '1',
      name: 'Modern Blue',
      imageUrl: 'https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-01',
    },
    {
      id: '2',
      name: 'Sunset Orange',
      imageUrl: 'https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2025-01-02',
    },
  ],
  loading: false,
};

const themesSlice = createSlice({
  name: 'themes',
  initialState,
  reducers: {
    addTheme: (state, action: PayloadAction<Omit<Theme, 'id' | 'createdAt'>>) => {
      const newTheme: Theme = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.themes.push(newTheme);
    },
    deleteTheme: (state, action: PayloadAction<string>) => {
      state.themes = state.themes.filter(theme => theme.id !== action.payload);
    },
  },
});

export const { addTheme, deleteTheme } = themesSlice.actions;
export default themesSlice.reducer;