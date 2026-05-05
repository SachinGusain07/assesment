import User from "../modules/auth/user.model.js";
import { setCookies } from "../utils/Cookies/cookie.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefereshToken } from "../utils/generateToken/authTokenGeneration.js";

export const isAuthenticated = (req , res , next) => {
  // const accessToken = req.body.accessToken;
  // const accessToken = req.cookies?.accessToken;
  const accessToken =
  req.cookies?.accessToken ||
  req.headers?.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      code: "TOKEN_MISSING",
      message: "Access Token not provided",
     
    });
  }
  try{
    const decode = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET)

    req.user = decode
    console.log(req.user , "user h ")
    next();

  }catch(err){

    // if(err.name ==="TokenExpiredError"){
    //     console.log(err);

    // //     return res.status(401).json({
    // //     success: false,
    // //     code: "TOKEN_EXPIRED",
    // //     message: "Access token expired"
    // //  })

    //  return reGenerateAccessToken(req, res, next);
    // }

    //   return res.status(401).json({
    //   success: false,
    //   code: "INVALID_TOKEN",
    //   message: "Invalid token"
    // });

     if (err.name === "TokenExpiredError") {
      return reGenerateAccessToken(req, res, next);
    }

    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Invalid token"
    });
  } 
};

export const reGenerateAccessToken= async(req, res, next)=>{

// const refreshToken = req.body.refreshToken;
const refreshToken = req.cookies?.refreshToken;

if(!refreshToken){

  return res.status(401).json({
    success: false,
    message : "Refresh Token is missing",
    code :"TOKEN_MISSING"

  })

}

const user = await User.findOne({refreshToken : refreshToken}).select("-password");

if(!user){
   return res.status(401).json({
    success: false,
    message : "Invalid refresh token",
    code :"DUPLICATE_TOKEN"
    
  })

}

try{
  const decode = jwt.verify(refreshToken , process.env.REFERESH_TOKEN_SECRET)

    const new_accessToken = generateAccessToken(user);
    const new_refreshToken = generateRefereshToken(user);
  
    if (!new_accessToken || !new_refreshToken) {
      return res.status(500).json({
        message: " something went wrong while generating token",
        success: false,
      });
    }
    // user.refreshToken = new_accessToken;
    user.refreshToken = new_refreshToken;
    await user.save();
  
    user.password = undefined;
    user.refreshToken = undefined;
    setCookies(res, "accessToken", new_accessToken, 15 * 60 * 1000);
    setCookies(res, "refreshToken", new_refreshToken, 7 * 24 * 60 * 60 * 1000);

    req.user = decode;
    next();
}catch{
 return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Invalid token"
    });
}
}





export const isAllowedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No user found",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Access denied",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };
};


