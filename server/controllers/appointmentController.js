const Appointment=require('../models/Appointment')

exports.bookAppointment=async(req,res)=>{
       try{
            const{doctor,date,time}=req.body;
            if(!doctor || !date || !time){
                res.status(400).json({message:"Tüm alanların doldurulması zorunludur"})
            }
            const existing=await Appointment.findOne({doctor,date,time}) //randevu varmı kontrolü
            if(existing){
                res.status(400).json({message:"Bu saate randevu zaten alınmış"})
            }
            //yeni randevu
            const appointment=new Appointment({
                patient:req.user._id,
                doctor,
                date,
                time
            })
            await appointment.save();
            res.status(201).json({message:"Randevu başarıyla oluşturuldu",appointment})
       }
       catch(error){
                res.status(500).json({message:"Randevu oluşturulamadı",error:error.message})
       }
}
 exports.cancelAppointment=async(req,res)=>{
        try{
            const {appointmentId}=req.params;
            const appointment=await Appointment.findById(appointmentId);
            if(!appointment){
                res.status(404).json({message:"Randevu bulunamadı"})
            }
            if(appointment.patient.toString() !==req.user._id.toString()){
                res.status(403).json({message:"Randevuyu silemeye yetkiniz yok"})
            }
            appointment.status="cancelled";
            await appointment.save();
            res.status(200).json({message:"Randevunuz iptal edildi",appointment})
        }
        catch(error){
            res.status(500).json({message:"İptal işlemi başarısız",error:error.message})
        }
}