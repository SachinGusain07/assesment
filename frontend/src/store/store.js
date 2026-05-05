// redux/store.js (or wherever your store is)
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"; // adjust path
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import devicesReducer from "../features/devices/deviceSlice"
import storage from "redux-persist/lib/storage"; 

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"], // Save only the auth state to local storage
};

const rootReducer = combineReducers({
  auth: authReducer,
  devices : devicesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);