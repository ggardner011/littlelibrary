import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../app/api";
import { getAxiosError } from "../../app/helpers";

interface UserState {
  name: string;
  email: string;
  isadmin: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: UserState = {
  name: "",
  email: "",
  isadmin: false,
  loading: false,
  success: false,
  error: null,
};

export const getUser = createAsyncThunk<
  { name: string; email: string; isadmin: boolean },
  undefined,
  { rejectValue: string }
>("user/me", async (_, thunkApi) => {
  try {
    const response = await api.get("/users/me");
    const { name, email, isadmin } = response.data;
    return { name, email, isadmin };
  } catch (error) {
    const message = getAxiosError(error);
    return thunkApi.rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.name = "";
      state.email = "";
      state.isadmin = false;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            name: string;
            email: string;
            isadmin: boolean;
          }>
        ) => {
          state.name = action.payload.name;
          state.email = action.payload.email;
          state.isadmin = action.payload.isadmin;
          state.loading = false;
          state.error = null;
          state.success = true;
        }
      )
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { resetUser } = userSlice.actions;

export default userSlice.reducer;
