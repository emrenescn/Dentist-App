const express=require('express')
const router=express.Router()
const authMiddleware=require('../middlewares/authMiddlewares')
const {getDoctorAppointments,approveAppointment,
    rejectAppointment,getApprovedDoctors,getAvailableTimes,
    getDoctorProfile,updateDoctorProfile}=require('../controllers/doctorController')

router.get('/my-appointments',authMiddleware,getDoctorAppointments)
router.put('/approve/:appointmentId',authMiddleware,approveAppointment)
router.put('/reject/:appointmentId',authMiddleware,rejectAppointment)
router.get('/get-approved-doctors',getApprovedDoctors)
router.get('/:doctorId/available-times',getAvailableTimes)
router.get('/profile',authMiddleware,getDoctorProfile)//doctor profili çekme
router.put('/profile',authMiddleware,updateDoctorProfile) //doctor profili güncelleme


module.exports=router;

 //doktor için bir apply sayfası yapacağız daha sonra admin dashboarda döneceğiz
