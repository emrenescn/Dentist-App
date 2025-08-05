const express=require('express')
const router=express.Router()
const authMiddleware=require('../middlewares/authMiddlewares')
const {applyDoctor,getDoctorAppointments,updateAppointmentStatus,getApprovedDoctors}=require('../controllers/doctorController')

router.post('/apply',authMiddleware,applyDoctor) //sadece login olanlar başvurur
router.get('/appointments',authMiddleware,getDoctorAppointments)
router.patch('/appointments/:appointmentId',authMiddleware,updateAppointmentStatus)
router.get('/get-approved-doctors',getApprovedDoctors)


module.exports=router;

//kaldığımız yer front endden gelen tarih ve saat bilgilerini randevuyu oluşturuken backende nasıl kaydedeceğiz bunu bulmak chatgptye yazdım oradan bakıp doldurursun 
