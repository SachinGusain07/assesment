import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Register failed"
      );
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post("/auth/logout");
      return null;
    } catch (error) {
      // Even if backend fails, we usually want to log out locally
      return thunkAPI.rejectWithValue("Logout failed on server");
    }
  }
);