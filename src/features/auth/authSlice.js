// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getCleanToken = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  let cleanToken = token;
  if (cleanToken.startsWith('Bearer ')) {
    cleanToken = cleanToken.substring(7);
  }
  
  const parts = cleanToken.split('.');
  if (parts.length !== 3) {
    localStorage.removeItem('auth_token');
    return null;
  }
  
  // بررسی انقضا
  try {
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp * 1000;
    if (Date.now() >= exp) {
      localStorage.removeItem('auth_token');
      return null;
    }
  } catch (e) {
    localStorage.removeItem('auth_token');
    return null;
  }
  
  return cleanToken;
};

const getInitialState = () => {
  const token = getCleanToken();
  const userData = localStorage.getItem('user_data');
  const user = userData ? JSON.parse(userData) : null;
  
  return {
    isLoading: false,
    isAuthenticated: !!token && token.length > 0,
    step: token ? 'authenticated' : 'phone',
    phoneNumber: '',
    verificationCode: '',
    error: null,
    countdown: 0,
    user,
    token,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setVerificationCode: (state, action) => {
      state.verificationCode = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setCountdown: (state, action) => {
      state.countdown = action.payload;
    },
    resetToPhoneStep: (state) => {
      state.step = 'phone';
      state.verificationCode = '';
      state.error = null;
      state.countdown = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = true;
      state.step = 'authenticated';
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('user_data', JSON.stringify(action.payload));
      }
    },
    setToken: (state, action) => {
      const token = action.payload;
      if (!token) {
        state.token = null;
        localStorage.removeItem('auth_token');
        return;
      }
      
      let cleanToken = token;
      if (cleanToken.startsWith('Bearer ')) {
        cleanToken = cleanToken.substring(7);
      }
      
      const parts = cleanToken.split('.');
      if (parts.length === 3) {
        state.token = cleanToken;
        localStorage.setItem('auth_token', cleanToken);
        state.isAuthenticated = true;
        state.step = 'authenticated';
      } else {
        state.token = null;
        localStorage.removeItem('auth_token');
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (state.user) {
        localStorage.setItem('user_data', JSON.stringify(state.user));
      }
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    handleUnauthorized: (state) => {
      state.isAuthenticated = false;
      state.step = 'phone';
      state.user = null;
      state.token = null;
      state.error = 'نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.';
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.step = 'phone';
      state.user = null;
      state.token = null;
      state.phoneNumber = '';
      state.verificationCode = '';
      state.error = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    },
  },
});

export const {
  setPhoneNumber,
  setVerificationCode,
  setStep,
  setCountdown,
  resetToPhoneStep,
  clearError,
  setAuthenticated,
  setToken,
  updateUser,
  setAuthError,
  handleUnauthorized,
  logout,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;