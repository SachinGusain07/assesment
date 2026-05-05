import { createSlice } from "@reduxjs/toolkit";
import { fetchDevices, createDevice, deleteDevice } from "./deviceAction";

const initialState = {
  devices: [], // This will hold the array of devices
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
};

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    clearDeviceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= FETCH DEVICES =================
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        // 🔥 FIX: Access .data from the backend response object
        state.devices = action.payload.data; 
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.devices = []; // Clear list on error to prevent mapping issues
      })

      // ================= CREATE DEVICE =================
      .addCase(createDevice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.loading = false;
        // Add new device to the beginning of the local list
        state.devices.unshift(action.payload); 
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DELETE DEVICE =================
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the deleted device using its _id
        state.devices = state.devices.filter(
          (device) => device._id !== action.payload
        );
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDeviceError } = deviceSlice.actions;
export default deviceSlice.reducer;

