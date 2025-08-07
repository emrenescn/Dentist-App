const express=require("express")
const router=express.Router()
const authMiddleware=require("../middlewares/authMiddlewares")
const {cancelAppointment,bookAppointment,getMyAppointments}=require("../controllers/appointmentController")


router.post('/book',authMiddleware,bookAppointment)
router.patch('/cancel/:appointmentId',authMiddleware,cancelAppointment)
router.get('/my-appointments',authMiddleware,getMyAppointments)
module.exports=router;