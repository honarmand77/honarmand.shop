// src/features/categories/categoriesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCategoriesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCategoriesError: (state, action) => {
      state.error = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
});

export const {
  setCategories,
  setSelectedCategory,
  setCategoriesLoading,
  setCategoriesError,
  clearSelectedCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;