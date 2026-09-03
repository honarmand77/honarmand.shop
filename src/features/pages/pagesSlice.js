// src/features/pages/pagesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pages: [],
  currentPage: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
};

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPagesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPagesError: (state, action) => {
      state.error = action.payload;
    },
    setPagesTotal: (state, action) => {
      state.total = action.payload;
    },
    setPagesTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
    clearPages: (state) => {
      state.pages = [];
      state.currentPage = null;
      state.error = null;
      state.total = 0;
      state.totalPages = 0;
    },
  },
});

export const {
  setPages,
  setCurrentPage,
  setPagesLoading,
  setPagesError,
  setPagesTotal,
  setPagesTotalPages,
  clearCurrentPage,
  clearPages,
} = pagesSlice.actions;

export default pagesSlice.reducer;