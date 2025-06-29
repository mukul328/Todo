import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            //verify the token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            //find user by ID

            req.user = await User.findById(decoded.id).select('-password');
            next();

        }
        catch(error){
            res.status(401).json({message: "Not authorized, token failed"});

        }


    }
    else if(req.cookies.token){
        try{
            token = req.cookies.token;

            //verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            //find by userID 
            req.user =await User.findById(decoded.id).select('-password');
            next();
        }catch(error){
            res.status(401).json({message: "Not authorized, token failed"});
        }
    }
    else{
        res.status(401).json({message: "Not authorized, token failed"});
    }
}

export {protect};