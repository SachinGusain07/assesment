

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None"
};


// for localhost testing
// export const cookieOptions = {
//   httpOnly: true,
//   secure: false, 
//   sameSite: "lax" 
// };

// export const setCookies = (res , name , value , maxAge)=>{

//     res.cookie(name , value , {
//           ...cookieOptions,
//           maxAge: 15 * 60 * 1000
//     })
// }

export const setCookies = (res, name, value, maxAge) => {
  res.cookie(name, value, {
    ...cookieOptions,
    maxAge   
  });
};

export const removeCookies = (res) => {

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    path: "/"
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    path: "/"
  });

};
