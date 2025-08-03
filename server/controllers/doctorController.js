const Doctor=require('../models/Doctor')
const Appointment=require('../models/Appointment')

exports.applyDoctor=async(req,res)=>{
    try{
        const userId=req.user._id;
        const{specialization,bio}=req.body;
        const existingApplication=await Doctor.findOne({userId});
        //başvuru kontrol 
        if(existingApplication){
            return res.status(400).json({message:"Zaten aktif bir başvurunuz mevcut"})
        }
        //yeni başvuru
        const newDoctorApplication=new Doctor({
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
//doktor randevularını listeleme ve onaylama reddetme kısmı
    exports.getDoctorAppointments=async(req,res)=>{
        try{
            const doctorProfile=await Doctor.findOne({user:req.user._id})
            if(!doctorProfile){
                return res.status(404).json({message:"Doktor bulunamadı"})
            }
            //randevuları getir hasta bilgileri ile birlikte sıralı asc
            const appointments=await Appointment.find({doctor:doctorProfile._id}).populate("patient","name email").sort({date:1,time:1})
            res.status(200).json({appointments})
        }
        catch(error){
            res.status(500).json({message:"Randevular Getirilemedi",error:error.message})
        }
    }
//doktor randevuları onaylar veya reddeder
    exports.updateAppointmentStatus=async(req,res)=>{
        try{
            const {appointmentId}=req.params;
            const {status}=req.body;
            if(!["approved","rejected"].includes(status)){
                return res.statusİ(400).json({message:"Mesaj geçersiz approved veya rejected olmalı"})
            }
            const doctorProfile=await Doctor.findOne({user:req.user._id})
            if(!doctorProfile){
                return res.status(404).json({message:"Doktor bulunamadı",error:error.message})
            }
            const appointment=await Appointment.findById(appointmentId)
            if(!appointment){
                return res.status(404).json({message:"Randevu bulunamadı",error:error.message})
            }
            //randevu bu doktora mı ait 
            if(appointment.doctor.toString()!==doctorProfile._id.toString()){
                return res.status(403).json({message:"Bu randevuya erişiminiz yok"})
            }
            appointment.status=status;
            await appointment.save();
            res.status(200).json({message:`Randevu ${status} olarak güncellendi`,appointment})
        }
        catch(error){
            res.status(500).json({message:"Randevu güncellenemedi",error:error.message})
        }
    }