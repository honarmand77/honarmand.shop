// src/features/banners/bannersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sliderBanners: [],
  smallBanners: [],
  timerBanners: [],
  dealOfWeek: null,
  collectionBanners: [],
  popularBanners: [],
  loading: false,
  error: null,
};

const bannersSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    setSliderBanners: (state, action) => {
      state.sliderBanners = action.payload;
    },
    setSmallBanners: (state, action) => {
      state.smallBanners = action.payload;
    },
    setTimerBanners: (state, action) => {
      state.timerBanners = action.payload;
    },
    setDealOfWeek: (state, action) => {
      state.dealOfWeek = action.payload;
    },
    setCollectionBanners: (state, action) => {
      state.collectionBanners = action.payload;
    },
    setPopularBanners: (state, action) => {
      state.popularBanners = action.payload;
    },
    setBannersLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBannersError: (state, action) => {
      state.error = action.payload;
    },
    clearBanners: (state) => {
      state.sliderBanners = [];
      state.smallBanners = [];
      state.timerBanners = [];
      state.dealOfWeek = null;
      state.collectionBanners = [];
      state.popularBanners = [];
      state.error = null;
    },
  },
});

export const {
  setSliderBanners,
  setSmallBanners,
  setTimerBanners,
  setDealOfWeek,
  setCollectionBanners,
  setPopularBanners,
  setBannersLoading,
  setBannersError,
  clearBanners,
} = bannersSlice.actions;

export default bannersSlice.reducer;