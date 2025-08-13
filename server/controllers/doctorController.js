const Doctor=require('../models/Doctor')
const Appointment=require('../models/Appointment')


//doktor randevularını listeleme ve onaylama reddetme kısmı
    exports.getDoctorAppointments=async(req,res)=>{
        try{
            const doctorProfile=await Doctor.findOne({user:req.user._id})
            if(!doctorProfile){
                return res.status(404).json({message:"Doktor bulunamadı"})
            }
            //randevuları getir hasta bilgileri ile birlikte sıralı asc
            const appointments=await Appointment.find({doctor:doctorProfile._id}).populate("patient","name email").sort({date:1,time:1})
            res.status(200).json(appointments)
        }
        catch(error){
            res.status(500).json({message:"Randevular Getirilemedi",error:error.message})
        }
    }
//doktor randevuları onaylar veya reddeder
   exports.approveAppointment=async(req,res)=>{
        try{
              const appointment=await Appointment.findById(req.params.appointmentId);
              if(!appointment){
                return res.status(404).json({message:"Randevunuz yok"})
              }
              appointment.status="approved";
              await appointment.save()
              res.status(200).json({message:"Randevu onaylandı"})
        }
        catch(error){
            res.status(500).json({message:"Onay sırasında hata oluştu",error:error.message});
        }
}
exports.rejectAppointment=async(req,res)=>{
        try{
            const appointment=await Appointment.findById(req.params.appointmentId);
            if(!appointment){
                return res.status(404).json({message:"Randevu bulunamadı"})
            }
            appointment.status="rejected";
            appointment.save()
            res.status(200).json({message:"Randevu reddedildi"})
        }
        catch(error){
            res.status(500).json({message:"Reddetme işlemi sırasında bir hata oluştu"})
        }
}

    exports.getApprovedDoctors=async(req,res)=>{ //sadece admin tarafından onaylanan doktorları getirir
            try{
                const doctors=await Doctor.find({isApproved:true}).populate("user","name email")
                res.status(200).json({doctors})
            }
            catch(error){
                    res.status(500).json({message:"Doktorlar getirilemedi",error:error.message})
            }
    }

    exports.getAvailableTimes=async(req,res)=>{ //randevu formunda hastanın seçceği saatleri ayarlıyoruz
            try{
                const{doctorId}=req.params;
                const{date}=req.query;

                const doctor=await Doctor.findById(doctorId);
                if(!doctor){
                    return res.status(404).json({message:"Doktor Bulunamadı"});
                }
                const allTimes=doctor.availableTimes; //doktorun kendi tanımlı saatleri

                const appointments=await Appointment.find({
                    doctor:doctorId,
                    date,
                    status:{$in:["pending","approved"]}
                })
                const bookedTimes=appointments.map((app)=>app.time)
                const availableTimes=allTimes.filter((t)=>!bookedTimes.includes(t)) //booktimede olmayan saatler uygun saatlerdir
                res.json({availableTimes})
            }
            catch(error){
                    res.status(500).json({message:"Saatler alınamadı",error:error.message})
            }
    }
    //doktor profilini getirme 
    exports.getDoctorProfile=async(req,res)=>{
            try{
                    const userId=req.user._id;
                    const doctor=await Doctor.findOne({user:userId}).populate("user","name email");
                    if(!doctor){
                        return res.status(404).json({message:"Doktor bulunamadı"});
                    }
                    res.status(200).json({doctor});
            }
            catch(error){
                    res.status(500).json({message:"Doktor profili getirilemedi",error:error.message})
            }
    }
    //doktor profili güncelleme
    exports.updateDoctorProfile=async(req,res)=>{
                try{
                    const userId=req.user._id;
                    const{phone,availableTimes,bio,specialization}=req.body;
                    const doctor=await Doctor.findOne({user:userId});
                    if(!doctor){
                        return res.status(404).json({message:"Doktor bulunamadı"})
                    }
                    if(specialization) doctor.specialization=specialization;
                    if(availableTimes) doctor.availableTimes=availableTimes
                    if(phone) doctor.phone=phone;
                    if(bio) doctor.bio=bio;
                    await doctor.save();
                    res.status(200).json({message:"Profil başarıla güncellendi"})
                }
                catch(error){
                    res.status(500).json({message:"Doktor profili güncellenemedi",error:error.message})
                }
    }

