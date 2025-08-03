const express=require("express")
const router=express.Router()
const authMiddleware=require("../middlewares/authMiddlewares")
const {cancelAppointment,bookAppointment}=require("../controllers/appointmentController")


router.post('/book',authMiddleware,bookAppointment)
router.patch('/cancel/:appointmentId',authMiddleware,cancelAppointment)

module.exports=router;