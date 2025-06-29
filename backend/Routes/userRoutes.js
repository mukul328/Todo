import express  from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import {protect} from '../Middleware/authMiddleware.js'
const router = express.Router();

router.post('/register',async (req,res)=>{
    const {name,email,password}= req.body;
    try{
        const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({message:'User already exists'});
    }
    const user = await User.create({name,email,password});
    if(user){
        generateToken(res,user._id)
        res.status(201).json({
            _id:user._id,
            name:user.name,
        });
    }
    else{
        res.status(400).json({message: 'Invalid user data'});
    }
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})

router.post('/login',async(req,res)=>{
    const{ email ,password}= req.body;

    const user = await User.findOne({email});
    if (user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name:user.name,
            email:user.email,
            token: generateToken(user._id),
        });
    } else{
        res.status(401).json({message:'Invalid email or password'});
    }
})

router.get('/profile',protect,async(req,res)=>{
    const user = await User.findById(req.user._id).select('-password');
    if(user){
        res.json({
            _id: user._id,
            name:user.name,
            email:user.email,
        });
    }else{
        res.status(404).json({message:"User not found"});
    }
})
//how to update your profile data .put is used to update data
router.put('/profile',protect,async(req,res)=>{
    const {name , currentPassword ,newPassword}= req.body;
    const user = await User.findById(req.user._id)

    if(!user){
        res.status(404).json({message:"User not found"});
    }
    if(name){
        user.name = name;
        //this will update the user name with the new name input 
    }

    //password 
    if(currentPassword && newPassword){
        //fist the current password would be matched with the password in the database if found correct the user pasword will be upadated with the new password
        if(await user.matchPassword(currentPassword)){
            user.password = newPassword;
        }
        else{
            res.status(404).json({message:"Current Password is wrong "});
        }
    }

    try{
        const upadatedUser = await user.save();
        res.json({
            _id:upadatedUser._id,
            name:upadatedUser.name,
            email:upadatedUser.email,
        });

    }catch(error){
        res.status(400).json({message:error.message});
    }
})

//for logout

router.post('/logout',(req,res)=>{
    res.cookie('jwt',{
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite:'Strict',
        maxAge: 0,
    })
    res.status(200).json({message:'Logged out Successfully'});
})

export default router;
