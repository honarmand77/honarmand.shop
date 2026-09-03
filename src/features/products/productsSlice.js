// src/features/products/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {
    category: null,
    search: '',
    orderBy: 'date',
    order: 'desc',
    minPrice: null,
    maxPrice: null,
  },
  pagination: {
    currentPage: 1,
    perPage: 20,
  },
  viewMode: 'grid',
  selectedProduct: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setOrderBy: (state, action) => {
      state.filters.orderBy = action.payload.orderBy;
      state.filters.order = action.payload.order;
    },
    setPriceRange: (state, action) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPerPage: (state, action) => {
      state.pagination.perPage = action.payload;
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'grid' ? 'list' : 'grid';
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
});

export const {
  setCategory,
  setSearch,
  setOrderBy,
  setPriceRange,
  setPage,
  setPerPage,
  toggleViewMode,
  resetFilters,
  selectProduct,
  clearSelectedProduct,
} = productsSlice.actions;

export default productsSlice.reducer;