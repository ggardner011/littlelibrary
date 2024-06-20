// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../app/api";
import { getAxiosError } from "../../app/helpers";
import { parseJwt } from "../../app/helpers";

interface AuthState {
  token: string | null;
  email: string | null;
  isadmin: boolean | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const token = localStorage.getItem("token");
var tokenEmail = null;
var tokenIsadmin = null;
if (token) {
  const parsedToken = parseJwt(token);
  tokenEmail = parsedToken.email;
  tokenIsadmin = parsedToken.isadmin;
}

const initialState: AuthState = {
  token: token || null,
  email: tokenEmail,
  isadmin: tokenIsadmin,
  loading: false,
  success: token != null ? true : false,
  error: null,
};

export const login = createAsyncThunk<
  { token: string; email: string; isadmin: boolean },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, thunkApi) => {
  try {
    const response = await api.post("/users/login", credentials);
    const { token } = response.data;
    const parsedToken = parseJwt(token);
    tokenEmail = parsedToken.email;
    tokenIsadmin = parsedToken.isadmin;
    localStorage.setItem("token", token);
    return { token, email: tokenEmail, isadmin: tokenIsadmin };
  } catch (error) {
    const message = getAxiosError(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const register = createAsyncThunk<
  { token: string; email: string; isadmin: boolean },
  { email: string; password: string; name: string },
  { rejectValue: string }
>("auth/register", async (credentials, thunkApi) => {
  try {
    const response = await api.post("/users/register", credentials);
    const { token } = response.data;
    const parsedToken = parseJwt(token);
    tokenEmail = parsedToken.email;
    tokenIsadmin = parsedToken.isadmin;
    localStorage.setItem("token", token);
    return { token, email: tokenEmail, isadmin: tokenIsadmin };
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
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            token: string;
            email: string;
            isadmin: boolean;
          }>
        ) => {
          state.token = action.payload.token;
          state.email = action.payload.email;
          state.isadmin = action.payload.isadmin;
          state.loading = false;
          state.error = null;
          state.success = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (
          state,
          action: PayloadAction<{
            token: string;
            email: string;
            isadmin: boolean;
          }>
        ) => {
          state.token = action.payload.token;
          state.email = action.payload.email;
          state.isadmin = action.payload.isadmin;
          state.loading = false;
          state.error = null;
          state.success = true;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.token = null;
        state.email = null;
        state.isadmin = null;
        state.loading = false;
        state.error = null;
        state.success = false;
      });
  },
});

export const { resetAuth } = authSlice.actions;

export default authSlice.reducer;
