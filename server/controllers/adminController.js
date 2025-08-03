const Doctor=require('../models/Doctor')

//onay bekleyen tüm doktorlar
exports.getAllPendingDoctors=async(req,res)=>{
    try{
            const pendingDoctors=await Doctor.find({isApproved:false}).populate("user","name email")
            if(!pendingDoctors){
                res.status(404).json({message:"Onay bekleyen doktor bulunamadı"})
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
        const {doctorId,approve}=req.body;
        if(typeof approve!=="boolean"){
            res.status(400).json({message:"approve değeri true yada false olmalı"})
        }

        const updatedDoctor=await Doctor.findByIdAndUpdate(doctorId,{isApproved:approve},{new:true});

        if(!updatedDoctor){
            return res.status(404).json({message:"Doktor bulunamadı"})
        }

        const statusMsg=approve ? "onaylandı":"reddedildi";
        res.status(200).json({
            message:`Doktor ${statusMsg}`,
            doctor:updatedDoctor
        })
    }
    catch(error){
            res.status(500).json({message:"Onay işlemi başarısız",error:error.message})
    }
}