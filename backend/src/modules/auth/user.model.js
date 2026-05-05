import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name:{
        type : String ,
        required : true,
    },

    email:{
        type :String,
        required : true ,
        unique : true,
    },

    password :{
        type : String,
        required : true 
    },
    phoneNumber :{
        type : String,
        required : true 
    },

    role :{
        type : String,
        enum : ["USER" , "ADMIN"],
        default : "USER"
    },
   
    refreshToken :{
        type : String,
        default : true ,
    },

},
{
    timestamps: true,
})

userSchema.index({email : 1});

const User = mongoose.model("User", userSchema);

export default User;