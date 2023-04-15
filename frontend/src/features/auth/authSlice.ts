// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../app/api";
import { getAxiosError } from "../../app/helpers";

interface AuthState {
  token: string | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
  token: token || null,
  loading: false,
  success: token != null ? true : false,
  error: null,
};

export const login = createAsyncThunk<
  string,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, thunkApi) => {
  try {
    const response = await api.post("/users/login", credentials);
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data.token;
  } catch (error) {
    const message = getAxiosError(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const register = createAsyncThunk<
  string,
  { email: string; password: string; name: string },
  { rejectValue: string }
>("auth/register", async (credentials, thunkApi) => {
  try {
    const response = await api.post("/users/register", credentials);
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data.token;
  } catch (error) {
    const message = getAxiosError(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk<void, void>("auth/logout", async () => {
  localStorage.removeItem("token");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.token = action.payload;
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<string>) => {
        state.token = action.payload;
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.token = null;
        state.loading = false;
        state.error = null;
        state.success = false;
      });
  },
});

export const { resetAuth } = authSlice.actions;

export default authSlice.reducer;
