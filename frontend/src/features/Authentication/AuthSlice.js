// features/Authentication/AuthSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// ----------- LOGIN ACTION -------------
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/web/api/userLogin`, {
        email,
        password
      });

      const token = response.data.token;
      const decoded = jwtDecode(token);

      // 🔐 Save to localStorage
      sessionStorage.setItem('user_token', token);
      sessionStorage.setItem('user_name', decoded.username);
      sessionStorage.setItem('user_id', decoded.id);

      return {
        token,
        username: decoded.username,
        userId: decoded.id,
        message: response.data?.message || "Login successful"
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

// ----------- INITIAL STATE -------------
const initialState = {
  token: sessionStorage.getItem('user_token') || null,
  username: sessionStorage.getItem('user_name') || null,
  userId: sessionStorage.getItem('user_id') || null,
  loading: false,
  error: null,
  successMessage: null
};

// ----------- SLICE -------------
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.username = null;
      state.token = null;
      state.userId = null;
      state.successMessage = null;
      state.error = null;

      // 🧹 Clear localStorage
      sessionStorage.removeItem('user_token');
      sessionStorage.removeItem('user_name');
      sessionStorage.removeItem('user_id');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.userId = action.payload.userId;
        state.successMessage = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
