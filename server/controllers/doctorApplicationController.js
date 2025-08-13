const DoctorApplication=require("../models/DoctorApplication")
const Doctor=require("../models/Doctor");
const { application } = require("express");


exports.applyDoctor=async(req,res)=>{
    try{
        const userId=req.user._id;
        const{specialization,bio}=req.body;
        const existingApplication=await DoctorApplication.findOne({user:userId,status:"pending"});
        //başvuru kontrol 
        if(existingApplication){
            return res.status(400).json({message:"Zaten aktif bir başvurunuz mevcut"})
        }
        //yeni başvuru
        const newDoctorApplication=new DoctorApplication({
            user:userId,
            specialization,
            bio
        });
        await newDoctorApplication.save();
        res.status(201).json({message:"Doktor Başvurunuz Başarıyla oluşturuldu",application:newDoctorApplication})
        }
    catch(error){
            res.status(500).json({message:"Başvuru sırasında bir hata oluştu",error:error.message})
        }
    }

//onay bekleyen tüm doktorlar
exports.getAllPendingDoctors=async(req,res)=>{
    try{
            const pendingDoctors=await DoctorApplication.find({status:"pending"}).populate("user","name email")
            if(!pendingDoctors){
                return res.status(404).json({message:"Onay bekleyen doktor bulunamadı"})
            }
            res.status(200).json({pendingDoctors})
    }
    catch(error){
            res.status(500).json({message:"Başvuru Alınamadı",error:error.message})
    }
}

//doktoru onaylama veya reddetme
exports.updateDoctorAproval=async(req,res)=>{
    try{
        const {applicationId,status}=req.body;
        console.log("Gelen body:", req.body);
        
        if(!["approved","rejected"].includes(status)){
            return res.status(400).json({message:"Status değeri approved veya rejected olmalı"})
        }
        const application=await DoctorApplication.findById(applicationId)
       console.log("Bulunan başvuru:", application);
        if (!application.user) {
  return res.status(400).json({ message: "Başvurunun bağlı olduğu kullanıcı bulunamadı" });
}
        if(!application){
            return res.status(404).json({message:"Başvuru bulunamadı"})
        }
        if(application.status!=="pending"){
            return res.status(400).json({message:"Bu başvuru zaten işleme alınmış"})
        }
        application.status=status; 
        await application.save();

        //eğer onaylanırsa doktor tablosuna kaydedelim 
        if(status==="approved"){
            const existingDoctor=await Doctor.findOne({user:application.user})
        
        if(!existingDoctor){
            const newDoctor=new Doctor({
                user:application.user,
                specialization:application.specialization,
                bio:application.bio,
                isApproved:true
            })
            console.log("Yeni doktor kaydediliyor:", newDoctor);
            await newDoctor.save();
        }
    }
        res.status(200).json({message:`Başvuru ${status==="approved" ? "onaylandı":"reddedildi"}`,application})
    }
    catch(error){
        console.error("update-doctor-approval hatası:", error);
            res.status(500).json({message:"Onay işlemi başarısız",error:error.message})
    }
}
//kullanıcının doktor başvurusu varmı 
exports.getMyApplication=async(req,res)=>{
            try {
                    const application=await DoctorApplication.findOne({user:req.user._id})
                    if(!application){
                        res.status(200).json({exists:false})
                    }
                    res.status(200).json({
                        exists:true,
                        status:application.status
                    })
            } catch (error) {
                res.status(500).json({message:"Sunucu hatası",error})
            }
}
