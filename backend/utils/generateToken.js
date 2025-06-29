import jwt from 'jsonwebtoken';
const generateToken =(res,userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '30d',
    })

    res.cookie('jwt',token,{
    httpOnly: true,
    secure: process.env.NODE_ENV==='production', //use secure cookies for production
    sameSite:'strict',
    //helps prevent CSRF attacks
    
})
}

export default generateToken;

