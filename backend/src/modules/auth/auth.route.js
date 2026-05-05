import express from "express"
// import { login } from "./auth.controller.js";
import { login, getMe , logout, registerUser} from "./auth.controller.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { refreshTokenHandler } from "./auth.controller.js";

const authRoute = express.Router();

authRoute.post("/login" , login);
authRoute.get("/me", isAuthenticated, getMe);

authRoute.post("/register", registerUser);


authRoute.post("/refresh", refreshTokenHandler);

authRoute.post("/logout", logout);

export default authRoute;