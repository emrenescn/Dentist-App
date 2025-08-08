const Appointment=require('../models/Appointment')

exports.bookAppointment=async(req,res)=>{
       try{
            const{doctor,date,time}=req.body;
            if(!doctor || !date || !time){
                return res.status(400).json({message:"Tüm alanların doldurulması zorunludur"})
            }
            const existing=await Appointment.findOne({doctor,date,time,status:{ $in: ["pending", "approved"]}}) //randevu varmı kontrolü
            if(existing){
               return  res.status(400).json({message:"Bu saate randevu zaten alınmış"})
            }
            //yeni randevu
            const appointment=new Appointment({
                patient:req.user._id,
                doctor,
                date,
                time,
                status:"pending"
            })
            await appointment.save();
            res.status(201).json({message:"Randevu başarıyla oluşturuldu",appointment})
       }
       catch(error){
                res.status(500).json({message:"Randevu oluşturulamadı",error:error.message})
       }
}
 exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Randevu bulunamadı" });
    }

    // Eğer randevu onaylanmamışsa sil
    if (appointment.status !== "approved") {
      await Appointment.findByIdAndDelete(appointmentId);
      return res.status(200).json({ message: "Randevu iptal edildi" });
    } else {
      return res.status(400).json({ message: "Onaylanmış randevu iptal edilemez" });
    }
  } catch (error) {
    res.status(500).json({ message: "İptal sırasında hata oluştu", error: error.message });
  }
};

exports.getMyAppointments=async(req,res)=>{
            try{
                const userId=req.user.id;
            const appointments=await Appointment.find({patient:userId}).populate({
                path:"doctor",
                select:"specialization user",
                populate:{
                    path:"user",
                    select:"name"
                } //burada doktor kullanıcı olarak kaydlduğu için doktorla bağlantılı olan userdan adını çektik iç içe populate yaptık
            }).sort({date:1,time:1})
            res.status(200).json({appointments});
            }
            catch(error){
                    res.status(500).json({message:"Randevular getirilemedi"})
            }
}