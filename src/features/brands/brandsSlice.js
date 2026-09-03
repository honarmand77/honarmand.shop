// src/features/brands/brandsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  selectedBrand: null,
  featuredBrands: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  perPage: 20,
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setFeaturedBrands: (state, action) => {
      state.featuredBrands = action.payload;
    },
    setBrandsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBrandsError: (state, action) => {
      state.error = action.payload;
    },
    setBrandsTotal: (state, action) => {
      state.total = action.payload;
    },
    setBrandsPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setBrandsPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    clearSelectedBrand: (state) => {
      state.selectedBrand = null;
    },
    clearBrands: (state) => {
      state.brands = [];
      state.featuredBrands = [];
      state.selectedBrand = null;
      state.error = null;
      state.total = 0;
    },
  },
});

export const {
  setBrands,
  setSelectedBrand,
  setFeaturedBrands,
  setBrandsLoading,
  setBrandsError,
  setBrandsTotal,
  setBrandsPage,
  setBrandsPerPage,
  clearSelectedBrand,
  clearBrands,
} = brandsSlice.actions;

export default brandsSlice.reducer;