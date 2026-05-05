import asyncHandler from "../../middlewares/asyncHandler.js";
import express from "express";
import User from "./user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefereshToken,
} from "../../utils/generateToken/authTokenGeneration.js";
import { setCookies } from "../../utils/Cookies/cookie.js";
import { userSignupSchema } from "./user.validation.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "missing email or password",
      success: false,
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      message: "user with email id not found",
      success: false,
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefereshToken(user);

  if (!accessToken || !refreshToken) {
    return res.status(500).json({
      message: " something went wrong while generating token",
      success: false,
    });
  }
  user.refreshToken = refreshToken;
  await user.save();

  user.password = undefined;
  user.refreshToken = undefined;
  setCookies(res, "accessToken", accessToken, 15 * 60 * 1000);
  setCookies(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);

  return res.status(200).json({
    message: "login successfully",
    success: true,
    user,
  });
});


export const registerUser = asyncHandler(async (req, res) => {
  const validation = userSignupSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: validation.error.format(),
    });
  }

  const { name, email, password  ,phoneNumber} = validation.data;


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password:hashedPassword,
    phoneNumber
  });

  newUser.password = undefined

  res.status(201).json({ success: true, data: newUser });
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});
export const refreshTokenHandler = asyncHandler(async (req, res) => {
  await reGenerateAccessToken(req, res, () => {
    res.status(200).json({ success: true });
  });
});



export const logout = asyncHandler(async (req, res) => {
  // Clear access token cookie
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
