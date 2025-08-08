const express=require('express')
const router=express.Router()
const authMiddleware=require('../middlewares/authMiddlewares')
const {applyDoctor,getDoctorAppointments,approveAppointment,rejectAppointment,getApprovedDoctors,getAvailableTimes}=require('../controllers/doctorController')

router.post('/apply',authMiddleware,applyDoctor) //sadece login olanlar başvurur
router.get('/my-appointments',authMiddleware,getDoctorAppointments)
router.put('/approve/:appointmentId',authMiddleware,approveAppointment)
router.put('/reject/:appointmentId',authMiddleware,rejectAppointment)
router.get('/get-approved-doctors',getApprovedDoctors)
router.get('/:doctorId/available-times',getAvailableTimes)


module.exports=router;

 
