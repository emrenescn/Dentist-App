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