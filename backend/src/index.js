import express from "express"
import authRoute from "./modules/auth/auth.route.js";
import router from "./modules/devices/devices.route.js";


const allRoutes = express.Router();


allRoutes.use("/auth" , authRoute)
allRoutes.use("/device" , router)

export default allRoutes