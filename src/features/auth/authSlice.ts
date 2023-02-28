import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { login, register, type LoginData, type RegisterData } from "./authAPI";

type LoginSuccessPayload = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: null;
    updatedAt: null;
  };
};

type RegisterSuccessPayload = LoginSuccessPayload;

export interface AuthState {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string | null;
    updatedAt: string | null;
  };
  isLoggedIn: boolean;

  status: "idle" | "loading" | "failed";
  error: any;
}

const initialState: AuthState = {
  token: "",
  user: {
    id: NaN,
    name: "",
    email: "",
    createdAt: null,
    updatedAt: null,
  },
  isLoggedIn: false,

  status: "idle",
  error: null,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (data: LoginData) => {
    const response = await login(data);
    return response;
  }
);

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (data: RegisterData) => {
    const response = await register(data);

    return response;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    resetAuthState(state) {
      state.status = "idle";
      state.error = null;
    },
    logoutAuth(state) {
      state.isLoggedIn = false;
      state.token = "";

      state.user.id = NaN;
      state.user.name = "";
      state.user.email = "";
      state.user.createdAt = null;
      state.user.updatedAt = null;

      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginAsync.fulfilled,
        (state, action: PayloadAction<LoginSuccessPayload>) => {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isLoggedIn = true;

          state.status = "idle";
          state.error = null;
        }
      )
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(registerAsync.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        registerAsync.fulfilled,
        (state, action: PayloadAction<RegisterSuccessPayload>) => {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isLoggedIn = true;

          state.status = "idle";
          state.error = null;
        }
      )
      .addCase(registerAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthUserId = (state: RootState) => state.auth.user.id;

export const { resetAuthState, logoutAuth } = authSlice.actions;

export const logoutAndResetStore =
  (): AppThunk => async (dispatch, getState) => {
    dispatch(logoutAuth());
    // dispatch(resetTasks());
    // dispatch(resetMembers());
  };

export default authSlice.reducer;
