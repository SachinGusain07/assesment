import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {

  if (!user?._id || !user?.email) {
    throw new Error("Invalid user data for token generation");
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m"
    }
  );
};

export const generateRefereshToken = (user)=>{

      if (!user?._id || !user?.email) {
    throw new Error("Invalid user data for token generation");
  }


  return jwt.sign(
     {
      id: user._id,
      email: user.email,
      role: user.role  
    },
    process.env.REFERESH_TOKEN_SECRET,
    {
        expiresIn : "15d"
    }
  )
}