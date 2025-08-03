const express=require('express')
const router=express.Router()
const authMiddleware=require('../middlewares/authMiddlewares')
const {applyDoctor}=require('../controllers/doctorController')
const {getDoctorAppointments,updateAppointmentStatus}=require('../controllers/doctorController')

router.post('/apply',authMiddleware,applyDoctor) //sadece login olanlar başvurur
router.get('/appointments',authMiddleware,getDoctorAppointments)
router.patch('/appointments/:appointmentId',authMiddleware,updateAppointmentStatus)


module.exports=router;
