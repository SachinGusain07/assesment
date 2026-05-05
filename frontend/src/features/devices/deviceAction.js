import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchDevices = createAsyncThunk(
  "devices/fetchAll",
  async (queryParams, thunkAPI) => {
    try {
      const params = new URLSearchParams(queryParams).toString();
      const res = await axiosInstance.get(`/device?${params}`);
      return res.data; // This MUST return the full object { success, data, totalPages... }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
// ADD NEW DEVICE
export const createDevice = createAsyncThunk(
  "devices/create",
  async (deviceData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/device/add", deviceData);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add device"
      );
    }
  }
);

// UPDATE DEVICE (The missing API)
export const updateDevice = createAsyncThunk(
  "devices/update",
  async ({ deviceId, updateData }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/device/update/${deviceId}`, updateData);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update device"
      );
    }
  }
);

// REMOVE DEVICE
export const deleteDevice = createAsyncThunk(
  "devices/delete",
  async (deviceId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/device/remove/${deviceId}`);
      return deviceId; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove device"
      );
    }
  }
);