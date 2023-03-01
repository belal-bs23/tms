import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import membersReducer from "../features/members/membersSlice";

const rootReducer = combineReducers({
  auth: persistReducer(
    {
      key: "auth",
      storage: storage,
      blacklist: ["status", "error"],
    },
    authReducer
  ),
  tasks: persistReducer(
    {
      key: "tasks",
      storage: storage,
      blacklist: ["status", "error", "extras"],
    },
    tasksReducer
  ),
  members: persistReducer(
    {
      key: "members",
      storage: storage,
      blacklist: ["status", "error", "extras"],
    },
    membersReducer
  ),
});

const persistConfig = {
  key: "root",
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
