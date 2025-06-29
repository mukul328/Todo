import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchma = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String ,
        required: true,
    },
},
{
    timestamps: true,
})

userSchma.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
    
})

userSchma.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//

const User = mongoose.model("User",userSchma);

export default User;