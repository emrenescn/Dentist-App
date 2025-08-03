const User=require('../models/User')
const jwt=require('jsonwebtoken')

const authMiddleware=async(req,res,next)=>{
        try{
            //header'da token var mı
            const authHeader=req.headers.authorization;
            if(!authHeader || !authHeader.startsWith("Bearer ")){
                    return res.status(401).json({message:"Yetkisiz Token Eksik"})
            }
            const token=authHeader.split(" ")[1]; //Bearerden sonraki kısım 
            const decoded=jwt.verify(token,process.env.JWT_SECRET)//tokeni doğrula
            req.user=await User.findById(decoded.id).select("-password") //kullanıcıyı bul ve req içerisine gönder
            next();//devam et
        }
        catch(error){
                return res.status(401).json({message:"Geçersiz Token",error:error.message})
        }
}
module.exports=authMiddleware;