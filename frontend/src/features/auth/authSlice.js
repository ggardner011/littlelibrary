import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api'

const token = localStorage.getItem('token');

const initialState = {
  token: token || null,
  loading: false,
  success: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, thunkApi) => {
  try {
    const response = await api.post('/users/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data.token;
  } catch (error) {

    const message = (error.response.data)
      || (error.response && error.response.data && error.response.data.message)
      || error.message
      || error.toString()
    return thunkApi.rejectWithValue(message)
  }
});

export const register = createAsyncThunk('auth/register', async (credentials, thunkApi) => {
  try {
    const response = await api.post('/users/register', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data.token;
  } catch (error) {
    const message = (error.response && error.response.data)
      || (error.response && error.response.data && error.response.data.message)
      || error.message
      || error.toString()
    return thunkApi.rejectWithValue(message)
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false
      state.error = null

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.token = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;