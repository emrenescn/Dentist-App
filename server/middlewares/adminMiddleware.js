const User=require('../models/User')
const jwt=require('jsonwebtoken')

const adminMiddleware=(req,res,next)=>{
    if(req.user.role!=="admin"){
         res.status(403).json({message:"Erişim Reddedildi Sadece Admin Kullanıcılar"})
           }
        next();
}
module.exports=adminMiddleware;