const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

exports.register=async(req,res)=>{
        try{
            const {name,email,password,role}=req.body;
            const existingUser=await User.findOne({email});//kullanıcı var mı?
            if(existingUser){
                return res.status(400).json({message:"Kullanıcı zaten kayıtlı"})
            }
            //şifreyi hashle
            const hashedPassword=await bcrypt.hash(password,13);
            //kullanıcı oluştur
            const newUser=new User({
                name,
                email,
                password:hashedPassword,
                role:role||"patient" //default user
            })
            await newUser.save();
            res.status(201).json({message:"Kullanıcı kayıtı başarılı"});
        }
        catch(error){
            res.status(500).json({message:"Sunucu hatası",error})
        }
}
exports.login=async(req,res)=>{
        try{
            const {email,password}=req.body;
            //Kullanıcı var mı
            const user=await User.findOne({email})
            if(!user){
                return res.status(404).json({message:"Kullanıcı Bulunamadı"})
            }
            //şifre kontrolü
            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(401).json({message:"Şifre Yanlış"})
            }
            //JWT Token oluştur
            const token=await jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1h"})
            res.status(200).json({message:"Giriş Başarılı",token,user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }})
        }
        catch(error){
                res.status(500).json({message:"Sunucu hatası",error})
        }


}