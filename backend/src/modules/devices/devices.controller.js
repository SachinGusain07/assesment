import asyncHandler from "../../middlewares/asyncHandler.js";
import { Device } from "./devices.model.js";

export const addDevice = asyncHandler(async (req, res) => {
  const { name, platform } = req.body;

  if (!name || !platform) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const newDevice = await Device.create({
      name,
      platform,
      owner: req.user.id, 
    });

    res.status(201).json({ success: true, data: newDevice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});



export const getDevices = asyncHandler(async (req, res) => {
  const { platform, name, sortBy, page = 1, limit = 5 } = req.query;

  let query = { owner: req.user.id };

  // Filtering
  if (platform && platform !== 'all') {
    query.platform = platform;
  }
  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  // Sorting Logic (Requirement #5)
  let sortOptions = {};
  if (sortBy === "name") {
    sortOptions.name = 1; // A-Z
  } else {
    sortOptions.createdAt = -1; // Latest first (Default)
  }

  // Pagination Logic (Requirement #6)
  const skip = (page - 1) * limit;

  const totalDevices = await Device.countDocuments(query);
  const devices = await Device.find(query)
    .sort(sortOptions)
    .limit(Number(limit))
    .skip(skip);

  res.status(200).json({ 
    success: true, 
    count: devices.length,
    totalPages: Math.ceil(totalDevices / limit),
    currentPage: Number(page),
    data: devices 
  });
});




export const removeDevice = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;

  const deletedDevice = await Device.findOneAndDelete({
    _id: deviceId,
    owner: req.user.id, // Security: Ensure user owns the device
  });

  if (!deletedDevice) {
    return res.status(404).json({ success: false, message: "Device not found or unauthorized" });
  }

  res.status(200).json({ success: true, message: "Device removed successfully" });
});


export const updateDevice = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const { name, platform } = req.body;

  let device = await Device.findOne({ _id: deviceId, owner: req.user.id });

  if (!device) {
    return res.status(404).json({ success: false, message: "Device not found" });
  }

  device.name = name || device.name;
  device.platform = platform || device.platform;

  const updatedDevice = await device.save();

  res.status(200).json({ success: true, data: updatedDevice });
});