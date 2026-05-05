import { Router } from "express";
import { addDevice, getDevices, removeDevice, updateDevice } from "./devices.controller.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";


const router = Router();

router.use(isAuthenticated);

router.post("/add",  addDevice);

// Route: GET /api/v1/devices (supports ?platform=... and ?name=...)
router.get("/", getDevices);

router.put("/", updateDevice);

router.delete("/remove/:deviceId", removeDevice);

export default router;